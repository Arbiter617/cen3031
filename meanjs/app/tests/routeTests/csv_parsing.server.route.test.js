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
var csv_file = fs.readFileSync(__dirname + '/../../../csv_files/grades.csv', "utf8"), csv_data_response;

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
		 		.send({data: csv_file,
		 			likert: {
		 				maximum: 30,
		 				minValue: 2,
		 				columns: '2,3,4,5',
		 				score1: 10,
		 				score2: 15,
		 				score3: 20,
		 				score4: 25,
		 				score5: 30,
		 			},
		 			courseTitle: 'Intro to software engineering',
		 			courseNumber: 'CEN3101',
		 			instructor: 'Kyle'
		 		})
   				.end(function (err,res) {
       				res.status.should.equal(200);
       				var csv_data_response = res.body;
       				done();
		 		});
		});
		it('CSV parsing with all columns counted.', function(done) {
			request
				.post('/csv_parsing')
		 		.send({data: csv_file,
		 			likert: {
		 				maximum: 30,
		 				minValue: 2,
		 				columns: '2,3,4,5',
		 				score1: 10,
		 				score2: 15,
		 				score3: 20,
		 				score4: 25,
		 				score5: 30,
		 			},
		 			courseTitle: 'Intro to software engineering',
		 			courseNumber: 'CEN3101',
		 			instructor: 'Kyle'
		 		})
   				.end(function (err,res) {
       				res.status.should.equal(200);
       				// Contains parsed csv file
       				var csv_data_response = res.body;
       				csv_data_response.numberOfStudents.should.equal(18);
       				csv_data_response.averageScore.should.equal(14.28);
       				csv_data_response.averageLikertScaleValue.should.equal(3);
       				csv_data_response.gradingScale.should.equal('0-30');
       				done();
		 		});
		});

		it('CSV parsing with all only the first column counted.', function(done) {
			request
				.post('/csv_parsing')
		 		.send({data: csv_file,
		 			likert: {
		 				maximum: 30,
		 				minValue: 2,
		 				columns: '2',
		 				score1: 10,
		 				score2: 15,
		 				score3: 20,
		 				score4: 25,
		 				score5: 30,
		 			},
		 			courseTitle: 'Intro to software engineering',
		 			courseNumber: 'CEN3101',
		 			instructor: 'Kyle'
		 		})
   				.end(function (err,res) {
       				res.status.should.equal(200);
       				// Contains parsed csv file
       				var csv_data_response = res.body;
       				
       				csv_data_response.numberOfStudents.should.equal(18);
       				csv_data_response.averageScore.should.equal(14.89);
       				csv_data_response.averageLikertScaleValue.should.equal(3);
       				csv_data_response.percentOfStudentsAchievingOutcomeAdequately.should.equal(88.89);
       				csv_data_response.gradingScale.should.equal('0-30');
       				
       				done();
		 		});
		});

	});

});