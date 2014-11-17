'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Course = mongoose.model('CourseOutcomeAssessmentForm'),
	request = require('supertest');

/**
 * Globals, id later becomes the mongodb id of a document so that it can
 * be used in id specific routes.
 */
var course, course2, course3, id, id2;

/**
 * Functional tests.
 * I wrote tests that should pass. The remaining tests that need to be written are those
 * that should throw an error. Like passing in a garbage id causes an error to be thrown.
 * Or passing in a garbage course causes an error. Stuff like that. Will be similar in the controller.
 */
describe('CourseOutcomeAssessmentForm Route Functional Tests:', function() {

	before(function(done) {
		course = new Course({
			outcome: 3,
			description: 'test course',
			courseNumber: 3101,
			term: 'FA2014',
			courseTitle: 'Intro to Software Engineering',
			instructor: 'Alin Dobra',
			date: new Date(),
			descriptionOfInstrument: 'this is test data.',
			numberOfStudents: 700,
			gradingScale: '0-100',
			averageScore: 81,
			scoreForAdequateOutcomeAchievement: 70,
			percentOfStudentsAchievingOutcomeAdequately: 70,
			averageLikertScaleValue: 2.5,
			instructorComments: 'this is test data comments.'
		});
		course2 = new Course({
			outcome: 1,
			description: 'test course2',
			courseNumber: 4600,
			term: 'SP2014',
			courseTitle: 'Operating Systems.',
			instructor: 'Test Instructor',
			date: new Date(),
			descriptionOfInstrument: 'this is test data.',
			numberOfStudents: 600,
			gradingScale: '0-10',
			averageScore: 55,
			scoreForAdequateOutcomeAchievement: 70,
			percentOfStudentsAchievingOutcomeAdequately: 10,
			averageLikertScaleValue: 1.5,
			instructorComments: 'this is test data comments.'
		});

		course3 = new Course({
			description: 'test course2',
			courseNumber: 4600,
			term: 'SP2014',
			courseTitle: 'Operating Systems.',
			instructor: 'Test Instructor',
			date: new Date(),
			descriptionOfInstrument: 'this is test data.',
			numberOfStudents: 600,
			gradingScale: '0-10',
			averageScore: 55,
			scoreForAdequateOutcomeAchievement: 70,
			percentOfStudentsAchievingOutcomeAdequately: 10,
			averageLikertScaleValue: 1.5,
			instructorComments: 'this is test data comments.'
		});
		done();

	});

	describe('/courseOutcomeAssessment tests', function() {
		//3001 because thats the port that runs when grunt test is called.
		var url = 'http://localhost:3001';
		//Request is used to mock the front end calls.
		request = request(url);

		it('should save a new CourseOutcomeAssessmentForm', function(done) {
			request
				.post('/courseOutcomeAssessment')
				.send(course)
      			.end(function (err,res) {
      				res.status.should.equal(200);
      				var courseResponse = res.body;
      				Course.findOne({instructor : 'Alin Dobra'}, function (err, courses) {
						id2 = course._id;
						courses.term.should.equal(course.term);
						done();
					});
			});
		});

		it('should save a second CourseOutcomeAssessmentForm', function(done) {
			request
				.post('/courseOutcomeAssessment')
				.send(course2)
      			.end(function (err,res) {
      				res.status.should.equal(200);
      				var courseResponse = res.body;
      				Course.findOne({instructor : 'Test Instructor'}, function (err, courses) {
      					id = courses._id;
						courses.term.should.equal(course2.term);
						done();
					});
				
				});
      	});
/*
		it('should fail to save a form without an outcome', function(done) {
			course2.term = ''
			request
				.post('/courseOutcomeAssessment')
				.send(course2)
      			.end(function (err,res) {
      				res.status.should.equal(400);
      				should.exist(err);
      				done();
				
				});
      	});
*/

		it('should return both of the newly created CourseOutcomeAssessmentForms', function(done) {
			request
				.get('/courseOutcomeAssessment')
      			.end(function (err,res) {
      				res.status.should.equal(200);
      				var courseResponse = res.body;
      				courseResponse.length.should.equal(2);
      				courseResponse[1].courseTitle.should.equal(course.courseTitle);
      				courseResponse[1].term.should.equal(course.term);
      				courseResponse[0].courseTitle.should.equal(course2.courseTitle);
      				courseResponse[0].term.should.equal(course2.term);
      				done();
      			});
		});
		
	});

	describe('/courseOutcomeAssessment/:id tests', function() {

		//This test is weird. Can't really verify the pdf is created. 
		//Go to the /controllers/pdfs folder and verify that it has been created.
		//Manually delete all the generated pdfs. 

		it('should create a pdf form based on the first course', function(done) {
			request
				.get('/courseOutcomeAssessment/' + id2)
				.end(function (err,res) {
					res.status.should.equal(200);
					done();
				});
		});
		
		it('should create a pdf form based on the second course', function(done) {
			request
				.get('/courseOutcomeAssessment/' + id)
				.end(function (err,res) {
					res.status.should.equal(200);
					done();
				});
		});

		//This test will need to be updated if we fix thte sorting of the get operation
		it('should successfully update a form', function(done) {
			course2.description = 'I am newly updated.';
			request
				.put('/courseOutcomeAssessment/' + id)
				.send(course2)
				.end(function (err,res) {
					res.status.should.equal(200);
					request
						.get('/courseOutcomeAssessment')
						.end(function(err2,res2) {
							var body = res2.body;
							body.length.should.equal(2);
							body[0].description.should.equal('I am newly updated.');
							done();
						});
				});
		});

		//Should successfully delete a form thus reducing the total number to two.
		it('should successfully delete a form', function(done) {
			request
				.delete('/courseOutcomeAssessment/' + id)
				.end(function (err,res) {
					res.status.should.equal(200);
					request
						.get('/courseOutcomeAssessment')
						.end(function(err2,res2) {
							var body = res2.body;
							body.length.should.equal(1);
							body[0].description.should.not.equal('I am newly updated.');
							body[0].description.should.equal('test course');
							done();
						});
				});
		});

	});
	
	after(function(done) {

		Course.remove().exec();
		done();
	});

});