'use strict';

/**
* Module Dependencies
*/

var should = require('should'),
	mongoose = require('mongoose'),
	courseOutcomesModel = mongoose.model('CourseOutcomeMappingForm'),
	request = require('supertest'),
	fs = require('fs');


/**
* Globals
*/

var outcomes1, outcomes2, outcomes3fail, outcomes4, outcomes5, outcomes6, array, id;

/**
* Unit tests
*/

describe('Course Outcome Mapping Unit Tests:', function(){
	beforeEach(function(done){
		outcomes1 = new courseOutcomesModel({
			courseTitle: 'CIS3020',
			outcomeA: 1,
			outcomeB: 0,
			outcomeC: 1,
			outcomeD: 1,
			outcomeE: 0,
			outcomeF: 1,
			outcomeG: 1,
			outcomeH: 0,
			outcomeI: 1,
			outcomeJ: 1,
			outcomeK: 0,
			outcomeL: 1,
		});
		outcomes2 = new courseOutcomesModel({
			courseTitle: 'CIS3022',
			outcomeA: 0,
			outcomeB: 0,
			outcomeC: 1,
			outcomeD: 1,
			outcomeE: 0,
			outcomeF: 0,
			outcomeG: 0,
			outcomeH: 0,
			outcomeI: 1,
			outcomeJ: 0,
			outcomeK: 0,
			outcomeL: 1,
		});
		outcomes3fail = new courseOutcomesModel({
			courseTitle: 1,
			outcomeA: 0,
			outcomeB: 0,
			outcomeC: 1,
			outcomeD: 1,
			outcomeE: 'This should fail',
			outcomeF: 0,
			outcomeG: 0,
			outcomeH: 0,
			outcomeI: 1,
			outcomeJ: 0,
			outcomeK: 0,
			outcomeL: 1,

		});
		outcomes4 = new courseOutcomesModel({
			courseTitle: 'CIS3023',
			outcomeA: 0,
			outcomeB: 0,
			outcomeC: 0,
			outcomeD: 0,
			outcomeE: 0,
			outcomeF: 0,
			outcomeG: 0,
			outcomeH: 1,
			outcomeI: 1,
			outcomeJ: 0,
			outcomeK: 0,
			outcomeL: 1,
		});
		outcomes5 = new courseOutcomesModel({
			courseTitle: 'COT3100',
			outcomeA: 0,
			outcomeB: 1,
			outcomeC: 1,
			outcomeD: 1,
			outcomeE: 0,
			outcomeF: 0,
			outcomeG: 1,
			outcomeH: 1,
			outcomeI: 1,
			outcomeJ: 0,
			outcomeK: 0,
			outcomeL: 1,
		});
		outcomes6 = new courseOutcomesModel({
			courseTitle: 'COP3530',
			outcomeA: 1,
			outcomeB: 1,
			outcomeC: 1,
			outcomeD: 1,
			outcomeE: 1,
			outcomeF: 1,
			outcomeG: 0,
			outcomeH: 0,
			outcomeI: 1,
			outcomeJ: 0,
			outcomeK: 0,
			outcomeL: 1,
		});

		array = [outcomes1, outcomes2, outcomes4, outcomes5, outcomes6];
		done();
	});





	describe('Method Save', function(){
		it('should be able to save without without problems', function(done) {
			return outcomes1.save(function(err){
				should.not.exist(err);
				done();
			});
		});

		it('should create excel spreadsheet', function(done){


			var json2xls = require('json2xls');
			//var json2csv = require('json2csv');


			/*
			var outcomesTest = [
			{
				'courseTitle': 'CIS3022',
				'outcomeA': 0,
				'outcomeB': 0,
				'outcomeC': 1,
				'outcomeD': 1,
				'outcomeE': 0,
				'outcomeF': 0,
				'outcomeG': 0,
				'outcomeH': 0,
				'outcomeI': 1,
				'outcomeJ': 0,
				'outcomeK': 0,
				'outcomeL': 1
			}
			];

			json2csv(
				{
					data: outcomesTest,
					fields: ['CourseTitle',
								'outcomeA',
								'outcomeB',
								'outcomeC',
								'outcomeD',
								'outcomeE',
								'outcomeF',
								'outcomeG',
								'outcomeH',
								'outcomeI',
								'outcomeJ',
								'outcomeK',
								'outcomeL']
				}, function(err, csv) {
					if (err) console.log(err);
					fs.writeFileSync('file.csv', csv, function(err){
						if (err) throw err;
						console.log('file saved');
					});
				});
			
			*/
			/*
			var json = {
			    foo: 'bar',
			    qux: 'moo',
			    poo: 123,
			    stux: new Date()
			}
			*/


			var stringifyOutcome = JSON.stringify(array, null, '\t');
			var parseFinalOutcome = JSON.parse(stringifyOutcome);
			//var xls = json2xls(json); // testing sample JSON object from right above this
			//var xls = json2xls(outcomes1); //testing actual course model JSON object defined way above
			fs.writeFileSync('./data.xls', json2xls(parseFinalOutcome), 'binary');
			//console.log(outcomes1);
			done();
		});

		it('should fail to save outcomes3fail because of incorrect data types', function(done){
			return outcomes3fail.save(function(err){
				should.exist(err);
				done();
			});
		});
	/*
	Write more functions later
	*/	



	});

	after(function(done){
		courseOutcomesModel.remove().exec();
		done();
	});
});