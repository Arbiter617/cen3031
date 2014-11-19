'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	request = require('supertest'),
	fs = require('fs');

/**
 * Globals, id later becomes the mongodb id of a document so that it can
 * be used in id specific routes.
 */
var csv_file = fs.readFileSync(__dirname + '/../../../csv_files/data.csv', "utf8"), csv_data_response;

/**
 * Load the CSV file
 */


/**
 * Functional tests.
 * I wrote tests that should pass. The remaining tests that need to be written are those
 * that should throw an error. Like passing in a garbage id causes an error to be thrown.
 * Or passing in a garbage course causes an error. Stuff like that. Will be similar in the controller.
 */
describe('CSV Parsing Route Functional Tests:', function() {
	describe('/csv_pasring tests', function() {
		//3001 because thats the port that runs when grunt test is called.
		 var url = 'http://localhost:3001';
		 //Request is used to mock the front end calls.
		 request = request(url);

		it('should send a csv file', function(done) {
		 	request
				.post('/csv_parsing')
		 		.send({data: csv_file})
   			.end(function (err,res) {
       			res.status.should.equal(200);
       			// Contains parsed csv file
       			var csv_data_response = res.body;
       			// console.log('got response back!' +csv_data_response);

       			done();
		 	});
		});
		it('should receive an average exam score of 59', function(done) {
			request
				.post('/csv_parsing')
		 		.send({data: csv_file})
   			.end(function (err,res) {
       			res.status.should.equal(200);
       			// Contains parsed csv file
       			var csv_data_response = res.body;
       			// console.log('got response back!' +csv_data_response);
       			csv_data_response.should.equal(59);
       			done();
		 	});
		});

	});

});