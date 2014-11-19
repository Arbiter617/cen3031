'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
 	Course = mongoose.model('CourseOutcomeAssessmentForm'),
 	httpMocks = require('node-mocks-http'),
 	Handlebars = require('handlebars'),
	phantom = require('phantom'),
	fs = require('fs'),
	controller = require('../../controllers/courseOutcomeAssessmentForm');
/**
 * Globals, id later becomes the mongodb id of a document so that it can
 * be used in id specific routes.
 */
var course, course2,  req, req2, res, res2, res3;

/**
 * Functional tests.
 * I wrote tests that should pass. The remaining tests that need to be written are those
 * that should throw an error. Like passing in a garbage id causes an error to be thrown.
 * Or passing in a garbage course causes an error. Stuff like that. Will be similar in the controller.
 */
describe('CourseOutcomeAssessmentForm Contoller Unit Tests:', function() {

	beforeEach(function(done) {
		course = new Course({
			outcome: 3,
			description: 'test course',
			courseNumber: 3101,
			term: 'FA2014',
			courseTitle: 'Intro to Software Engineering',
			instructor: 'Kyle Kyrazis',
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
	
		
		req = httpMocks.createRequest({
			method: 'POST',
			url: '/courseOutcomeAssessment',
			body: course
		});

		res = httpMocks.createResponse();
		res2 = httpMocks.createResponse();
		res3 = httpMocks.createResponse();


		
		done();

	});

	describe('CourseOutcomeAssessmentForm create Tests', function() {


		it('should create a new CourseOutcomeAssessmentForm', function(done) {
			controller.create(req,res, function() {
				var code = JSON.parse(res._getStatusCode());
				var data = JSON.parse(res._getData());
				data.courseNumber.should.equal(course.courseNumber);
				code.should.equal(200);
				done();
			});
		});

		it('should fail to create a new form without a course title.', function(done) {
			course.courseTitle = '';
			req.body = course;
			controller.create(req,res, function() {
				var code = JSON.parse(res._getStatusCode());
				code.should.equal(400);
				done();
			});
      	});
    });

	describe('CourseOutcomeAssessmentForm list Tests', function() {
		it('should list 2 courseForms by date and courseNumber', function(done) {
			controller.create(req,res, function() {
				var code = JSON.parse(res._getStatusCode());
				code.should.equal(200);
				req.body = course2;
				controller.create(req,res2, function() {
					code = JSON.parse(res2._getStatusCode());
					code.should.equal(200);
					controller.list(req,res3, function() {
						var data = JSON.parse(res3._getData());
						code = JSON.parse(res3._getStatusCode());
						data[0].courseNumber.should.equal(course2.courseNumber);
						data[1].courseNumber.should.equal(course.courseNumber);
						code.should.equal(200);
						done();
					});
				});
			});
		});
	});
			
	describe('CourseOutcomeAssessmentForm update Tests', function() {
		it('should successfully update a already created form', function(done) {
			controller.create(req,res, function() {
				var code = JSON.parse(res._getStatusCode());
				code.should.equal(200);
				var data = JSON.parse(res._getData());
				var id = data._id;
				Course.findById(id).exec(function(err, course) {
					req.course = course;
					req.body = {courseNumber : 1004};
					controller.update(req,res2, function() {
						data = JSON.parse(res2._getData());
						code = res2._getStatusCode();
						code.should.equal(200);
						data.courseNumber.should.equal(1004);
						done();
					});
				});
			});
		});

		it('should fail to update without correct data', function(done) {
			controller.create(req,res, function() {
				var code = JSON.parse(res._getStatusCode());
				code.should.equal(200);
				var data = JSON.parse(res._getData());
				var id = data._id;
				Course.findById(id).exec(function(err, courses) {
					req.course = courses;
					req.body = {courseNumber : 'Random data'};
					controller.update(req,res2, function() {
						code = res2._getStatusCode();
						code.should.equal(400);
						done();
					});
				});
			});
		});


	});
	
	describe('CourseOutcomeAssessmentForm delete Tests', function() {
		it('should be able to delete a form that is already there', function(done) {
			controller.create(req,res, function() {
				var code = JSON.parse(res._getStatusCode());
				code.should.equal(200);
				var data = JSON.parse(res._getData());
				var id = data._id;
				Course.findById(id).exec(function(err, courses) {
					req.course = courses;
					controller.delete(req,res2, function() {
						code = res2._getStatusCode();
						var data2 = JSON.parse(res2._getData());
						data2.courseNumber.should.equal(data.courseNumber);
						code.should.equal(200);
						done();
					});
				});
			});

		});
	});

	describe('CourseOutcomeAssessmentForm Read Tests', function() {
		it('should be able to generate a html string from the courseOutcomeAssessmentForm html file.', function(done) {
			var filename = __dirname + '/../../controllers/pdfModels/CourseOutcomeAssessmentForm.html';
			fs.readFile(filename, function(err,data) {
				should.not.exist(err);
				var template = Handlebars.compile(data.toString());
				var result = template(course);
				done();
			});
		});	
	});
	
	describe('CourseOutcomeAssessmentForm findById Tests', function() {
		it('should be able to find the correct object for the given id', function(done) {
			controller.create(req,res, function() {
				var code = JSON.parse(res._getStatusCode());
				code.should.equal(200);
				var data = JSON.parse(res._getData());
				var id = data._id;

				controller.courseOutcomeAssessmentByID(req, res2, function(err) {
					should.not.exist(err);
					done();
				}, id);
			});
		});

		it('should fail to find an object thats not created', function(done) {
			var id = course._id;
			controller.courseOutcomeAssessmentByID(req, res2, function(err) {
				should.exist(err);
				done();
			}, id);
		});




	});

	afterEach(function(done) {
		Course.remove().exec();
		done();
	});

});