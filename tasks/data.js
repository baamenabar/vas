var Converter = require('csvtojson').core.Converter;//https://www.npmjs.org/package/csvtojson
var fs=require('fs');
var async = require('async');
var cheerio = require('cheerio');
var request = require('request');

var species = [];
var globalCount = 0;

exports.convertCSV = function() {
	var csvFileName = './src_data/species.csv';
	var flStr=fs.createReadStream(csvFileName);
	//new converter instance
	//var param={};
	var csvConverter=new Converter({});//the example had a param empty object

	//end_parsed event will be emmited at the end
	csvConverter.on('end_parsed', function(jsonObj) {
		console.log('CSV file parsed as a JSON document with '+jsonObj.length+' length.');
		var len = jsonObj.length;
		var oneSpotting, oneSpecie;
		species = [];
		//https://github.com/caolan/async#eachseriesarr-iterator-callback
		async.eachSeries(jsonObj,spottingToSpecie,function(err) {
			if (err) {
				console.log('The has been an error looping the spottings',err);
			}
			fs.writeFile('./src_data/species-data-list.json', JSON.stringify(species, null, 4), console.log('wrote json file'));
		});
		//console.log(jsonObj[3]['Noah ID']); //here be magic
	});

	flStr.pipe(csvConverter);
};

var spottingToSpecie = function(spotting, callback){
	console.log('begin parse of: '+spotting['Scientific Name']);
	var newSpecie = false;
	currSpecie = findInSpecies(spotting);
	if(!currSpecie){
		var binominal = spotting['Scientific Name'];
		var taxa = binominal.split(' ');
		console.log(binominal + 'not fount in list, creating new.');
		currSpecie = {
			_id: globalCount,
			template	: spotting.Category,
			label 		: spotting['Common Name'],
			sublabel	: binominal,
			searchText 	: spotting.Tags,
			images 		: {
				baseName: binominal,
				list: []
			},
			thumbnail 	: '',
			group 		: spotting.Category,
			subgroup 	: spotting.Category,
			details : {
				genus 		: taxa[0],
				specie 		: taxa[1],
				commonNames	: [spotting['Common Name']],
				biology		: spotting.Description,
				identifyingCharacteristics	: '',
				use			: '',
				flower		: [],
				fruit		: [],
				etymology	: '',
				distribution: '',
				habitat		: spotting.Habitat,
				nativeStatus: '',
				conservationStatuses		: [],
				descripted	: '',
				synonymum	: [],
				sources		: [],
				spottings	: [
					{
						noahId	: spotting['Noah ID'],
						latitude:spotting.Latitude,
						longitude:spotting.Longitude,
						date: spotting['Spotted Date']
					}
				]
			}
		};
		newSpecie = true;
		globalCount++;
	}else{
		console.log(currSpecie.sublabel + ' found in list, adding data.');
		currSpecie.searchText += spotting.Tags;
		if(currSpecie.details.commonNames.indexOf(spotting['Common Name']) == -1){
			currSpecie.details.commonNames.push(spotting['Common Name']);
		}
		if(spotting.Description.length > currSpecie.details.biology.length){
			currSpecie.details.biology = spotting.Description;
		}
		if(spotting.Habitat.length > currSpecie.details.habitat.length){
			currSpecie.details.habitat = spotting.Habitat;
		}
		currSpecie.details.spottings.push(
				{
					noahId	: spotting['Noah ID'],
					latitude:spotting.Latitude,
					longitude:spotting.Longitude,
					date: spotting['Spotted Date']
				}
			);
	}

//---------- import images

	loadSpecieImages(currSpecie, function(){
		if(newSpecie)species.push(currSpecie);
		callback();
	});
};

var loadSpecieImages = function(specie, callback) {
	//specie.images
	async.eachSeries(specie.details.spottings, loadSpottingImages.bind(null, specie.images), function(err) {
		console.log('now images has :'+specie.images.list.length, 'elements');		
		callback();	
	});
};

var loadSpottingImages = function(imagesList, spotting, callback) {
	//imagesList;
	request('http://www.projectnoah.org/spottings/'+spotting.noahId, function(err, resp, html) {
		if(err){
			return console.log('Error whie trying to load spotting page', err);
		}
		var $ = cheerio.load(html);
		var sselector = $('.photo-switcher-photo img');
		if(!sselector.get().length){
			console.log('there is only one image, ');
			sselector = $('#spotting_image');
		}
		sselector.each(function(i,ele) {
			var remoteUri = $(this).attr('src').split('=s')[0];
			imagesList.list.push({
				remote:remoteUri,
				local:'pnd - '+imagesList.baseName+' - 0'+imagesList.list.length+'.jpg'
			});
		});
		async.eachSeries(imagesList.list, download, function(err){
			console.log('all images for '+imagesList.baseName+' have been downloaded');
			callback();
		} );
	});
};

var download = function(uris, callback){
	console.log('trying to download '+uris.remote+' and save to '+uris.local);
	var imagesPath = './src_data/imgs/';
	if( fs.existsSync( imagesPath+uris.local ) ){
		console.log('image already exists, skipping');
		return callback();
	}
	var fullUri = uris.remote+'=s800';//to make the image 800px wide
  request.head(fullUri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    if (err) {
    	console.log('There was an error retrieveing the image',err);
    	callback(err);
    }

    request(fullUri).pipe(fs.createWriteStream(imagesPath+uris.local)).on('close', callback);
  });
};

var findInSpecies = function(spotting){
	var i, 
	len = species.length,
	binominal = spotting['Scientific Name'];
	for (i = 0; i < len; i++) {
		if(species[i].sublabel === binominal){
			return species[i];
		}
	}
	return false;
};

exports.createThumbnails = function(callback) {
	fs.readFile('./src_data/species-data-list.json', 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}

		species = JSON.parse(data);

		//console.dir(data);
		async.eachSeries(species, findAndAsignThumbnail, function(err){
			if (err) {
				console.log('Hubo un error asignando thumbnails',err);
			}else{
				convertTerms(function() {
					fs.writeFile('./www/data/species-data-list.json', JSON.stringify(species, null, 4), console.log('wrote json file'));
					callback();
				});
			}
		});
	});
};

var findAndAsignThumbnail = function(specie, callback){
	if(!specie.images.list[0]){
		console.log('Fatal error, missing images for: ',specie.images);
		callback('Fatal error, missing images for: '+specie.images.baseName);
	}
	specie.thumbnail = specie.images.list[0].local;
	fs.createReadStream('./src_data/imgs/'+specie.thumbnail).pipe(fs.createWriteStream('./src_data/imgs/thumbs/'+specie.thumbnail));
	var tList = [];
	for(var i = 0; i < specie.images.list.length; i++){
		tList.push({
			credit:'Agustín Amenabar L.',
			filename: specie.images.list[i].local,
			imageDescription:''
		});
	}
	specie.images.list = tList;
	callback();
};

exports.termsManipulation = function() {
	fs.readFile('./www/data/species-data-list.json', 'utf8', function (err, data) {
		if (err) {
			console.log('Error: ' + err);
			return;
		}

		species = JSON.parse(data);

		convertTerms(function() {
			fs.writeFile('./www/data/species-data-list.json', JSON.stringify(species, null, 4), console.log('wrote json file'));
		});
	});
};

var convertTerms = function(callback) {
	for (var i = 0; i < species.length; i++) {
		var specie = species[i];
		if(specie.group === 'invertebrate'){
			specie.subgroup = specie.group = 'artropoda';
		}else if(specie.group === 'reptile'){
			specie.subgroup = specie.group = 'reptilia';
		}
		/*for (var e = 0; e < specie.images.length; e++) {
			var oneImage = specie.images[e]
		};*/
	}
	callback();
};