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
		var len = jsonObj.length;
		var oneSpotting, oneSpecie;
		species = [];
		//https://github.com/caolan/async#eachseriesarr-iterator-callback
		async.eachSeries(jsonObj,spotingToSpecie,function(err) {
			if (err) {
				console.log('The has been an error looping the spottings',err);
			}
			fs.writeFile('./species-data-list.json', species, console.log('wrote:',species));
		});
		for (var i = 0; i < len; i++) {
			oneSpotting = jsonObj[i];
			oneSpecie = {

			};
			species.push(oneSpecie);
		}
		console.log(jsonObj[3]['Noah ID']); //here be magic
	});

	flStr.pipe(csvConverter);
};

var spotingToSpecie = function(spoting, callback){
	currSpecie = findInSpecies(spoting);
	if(!currSpecie){
		var binominal = spoting['Scientific Name'];
		var taxa = binominal.split(' ');
		currSpecie = {
			_id: globalCount,
			template: spoting['Category'],
			label: spoting['Common Name'],
			sublabel: binominal,
			searchText: spoting['Tags'],
			images:[],
			thumbnail:'',
			group : spoting['Category'],
			subgroup : spoting['Category'],
			details : spoting['Category']
		};
		globalCount++;
	}else{

	}
	callback();
};

var findInSpecies = function(spoting){
	var i, 
	len = species.length,
	binominal = spoting['Scientific Name'];
	for (i = 0; i < len; i++) {
		if(species[i].sublabel === binominal){
			return species[i];
		}
	}
	return false;
};