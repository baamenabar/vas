var Converter = require('csvtojson').core.Converter;//https://www.npmjs.org/package/csvtojson
var fs=require('fs');
var async = require('async');

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
			fs.writeFile('./species-data-list.json', JSON.stringify(species, null, 4), console.log('wrote json file'));
		});
		//console.log(jsonObj[3]['Noah ID']); //here be magic
	});

	flStr.pipe(csvConverter);
};

var spottingToSpecie = function(spotting, callback){
	console.log('begin parse of: '+spotting['Scientific Name']);
	currSpecie = findInSpecies(spotting);
	if(!currSpecie){
		var binominal = spotting['Scientific Name'];
		var taxa = binominal.split(' ');
		currSpecie = {
			_id: globalCount,
			template	: spotting.Category,
			label 		: spotting['Common Name'],
			sublabel	: binominal,
			searchText 	: spotting.Tags,
			images 		: [],
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
		globalCount++;
	}else{
		
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
	species.push(currSpecie);
	callback();
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