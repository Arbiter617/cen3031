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
			score1: 10,
 			score2: 15,
 			score3: 20,
 			score4: 25,
 			score5: 30,
			courseNumber: 'CEN3031',
			term: 'Fall 2014',
			courseTitle: 'Intro to Software Engineering',
			instructor: 'Professor Dobra',
			date: new Date(), // Is this proper syntax for
			descriptionOfInstrument: 'String describing instrument..whatever this means',
			numberOfStudents: 45,
			gradingScale: '0-10',
			averageScore: 82,
			scoreForAdequateOutcomeAchievement: 70,
			percentOfStudentsAchievingOutcomeAdequately: 95,
			averageLikertScaleValue: 4,
			columns: '2,3,4,5',
			instructorComments: 'Room for instructor comments.'
		});
		course2 = new Course({
			score1: 10,
 			score2: 15,
 			score3: 20,
 			score4: 25,
 			score5: 30,
			courseNumber: 'COP3503',
			term: 'Fall 2014',
			courseTitle: 'Programming Two',
			instructor: 'Professor Roytman',
			date: new Date(), //Same date concern as above
			descriptionOfInstrument: 'Second time describing instrument',
			numberOfStudents: 52,
			gradingScale: '0-10',
			averageScore: 75,
			scoreForAdequateOutcomeAchievement: 75,
			percentOfStudentsAchievingOutcomeAdequately: 87,
			averageLikertScaleValue: 3,
			columns: '2,3,4,5',
			instructorComments: 'No comments'
		});

		course3 = new Course({
			test: 'data'
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
      				Course.findOne({instructor : 'Professor Dobra'}, function (err, courses) {
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
      				Course.findOne({instructor : 'Professor Roytman'}, function (err, courses) {
      					id = courses._id;
						courses.term.should.equal(course2.term);
						done();
					});
				
				});
      	});

		it('should fail to save a bad form', function(done) {
			request
				.post('/courseOutcomeAssessment')
				.send(course3)
      			.end(function (err,res) {
      				res.status.should.equal(400);
      				done();
				});
      	});



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
	
		//This test will need to be updated if we fix thte sorting of the get operation
		it('should successfully update a form', function(done) {
			course2.instructor = 'Kyle Kyrazis'
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
							body[0].instructor.should.equal('Kyle Kyrazis');
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
							body[0].instructor.should.not.equal('Kyle Kyrazis');
							body[0].instructor.should.equal('Professor Dobra');
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