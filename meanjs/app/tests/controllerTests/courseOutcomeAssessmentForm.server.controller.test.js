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

		done();
	});

	describe('CourseOutcomeAssessmentForm create Tests', function() {


		it('should create a new CourseOutcomeAssessmentForm', function(done) {
			var res = {
				status: function(value) {
					this.statusCode = value;
				},
				jsonp: function(object) {
	            	this.statusCode.should.equal(200);
					object.courseNumber.should.equal(course.courseNumber);
					this.done();
				},
				statusCode: 200,
				done: done
			};
			controller.create(req,res);
		});

		it('should fail to create a new form without a course title.', function(done) {
			course.courseTitle = '';
			req.body = course;
			var res = {
				status: function(value) {
					this.statusCode = value;
				},
				send: function(object) {
					this.statusCode.should.equal(400);
					this.done();
				},
				statusCode: 200,
				done: done
			};

		 	controller.create(req,res);
      	});
    });

	describe('CourseOutcomeAssessmentForm list Tests', function() {
		it('should list 2 courseForms by date and courseNumber', function(done) {
			var res3 = {
				status: function(value) {
					this.statusCode = value;
				},
				jsonp: function(object) {
	            	this.statusCode.should.equal(200);
					object[0].courseNumber.should.equal(course2.courseNumber);
					object[1].courseNumber.should.equal(course.courseNumber);
					this.done();
				},
				statusCode: 200,
				done: done
			};
			var res2 = {
				status: function(value) {
					this.statusCode = value;
				},
				jsonp: function(object) {
	            	this.statusCode.should.equal(200);
	            	controller.list(req,res3);
				},
				statusCode: 200
			};
			var res = {
				status: function(value) {
					this.statusCode = value;
				},
				jsonp: function(object) {
	            	this.statusCode.should.equal(200);
					req.body = course2;
					controller.create(req,res2);
				},
				statusCode: 200
			};
			controller.create(req,res);
		});
	});
			
	describe('CourseOutcomeAssessmentForm update Tests', function() {
		it('should successfully update a already created form', function(done) {
			var res2 = {
				status: function(value) {
					this.statusCode = value;
				},
				jsonp: function(object) {
	            	this.statusCode.should.equal(200);
	            	object.courseNumber.should.equal(1004);
	            	this.done();
				},
				statusCode: 200,
				done: done
			};
			var res = {
				status: function(value) {
					this.statusCode = value;
				},
				jsonp: function(object) {
	            	this.statusCode.should.equal(200);
	            	var id = object._id;
	            	Course.findById(id).exec(function(err, course) {
						req.course = course;
						req.body = {courseNumber : 1004};
						controller.update(req,res2);
					});
				},
				statusCode: 200
			};
			controller.create(req,res);
		});

		it('should fail to update without correct data', function(done) {
			var res2 = {
				status: function(value) {
					this.statusCode = value;
				},
				send: function(object) {
					this.statusCode.should.equal(400);
					this.done();
				},
				statusCode: 200,
				done: done
			};
			var res = {
				status: function(value) {
					this.statusCode = value;
				},
				jsonp: function(object) {
	            	this.statusCode.should.equal(200);
	            	var id = object._id;
	            	Course.findById(id).exec(function(err, course) {
						req.course = course;
						req.body = {courseNumber : 'Random data'};
						controller.update(req,res2);
					});
				},
				statusCode: 200
			};
			controller.create(req,res); 
		});


	});
	
	describe('CourseOutcomeAssessmentForm delete Tests', function() {
		it('should be able to delete a form that is already there', function(done) {
			var res2 = {
				status: function(value) {
					this.statusCode = value;
				},
				jsonp: function(object) {
					this.statusCode.should.equal(200);
					object.courseNumber.should.equal(3101);
					this.done();
				},
				statusCode: 200,
				done: done
			};
			var res = {
				status: function(value) {
					this.statusCode = value;
				},
				jsonp: function(object) {
	            	this.statusCode.should.equal(200);
	            	var id = object._id;
	            	Course.findById(id).exec(function(err, course) {
						req.course = course;
						controller.delete(req,res2);
					});
				},
				statusCode: 200
			};
			controller.create(req,res);
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
			
			var res = {
				status: function(value) {
					this.statusCode = value;
				},
				jsonp: function(object) {
	            	this.statusCode.should.equal(200);
	            	var id = object._id;
	            	controller.courseOutcomeAssessmentByID(req,res2,function(err) {
	            		should.not.exist(err);
	            		done();
	            	}, id);
				},
				statusCode: 200,
				done: done
			};
			controller.create(req,res); 
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