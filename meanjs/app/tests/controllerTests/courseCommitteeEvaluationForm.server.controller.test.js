'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	CourseModel = mongoose.model('CourseOutcomeAssessmentForm'),
 	CourseCommittee = mongoose.model('CourseCommitteeEvaluationForm'),
 	httpMocks = require('node-mocks-http'),
 	Handlebars = require('handlebars'),
	phantom = require('phantom'),
	fs = require('fs'),
	controller = require('../../controllers/courseCommitteeEvaluationForm'),
	util = require('util');
/**
 * Globals, id later becomes the mongodb id of a document so that it can
 * be used in id specific routes.
 */
var courseModel1, courseEvaluation, req, req2, res, res2, res3;

/**
 * Functional tests.
 * I wrote tests that should pass. The remaining tests that need to be written are those
 * that should throw an error. Like passing in a garbage id causes an error to be thrown.
 * Or passing in a garbage course causes an error. Stuff like that. Will be similar in the controller.
 */

 /**
  * File adjusted to conform to courseCommitteEvaluationForm
  */

describe('CourseCommitteeEvaluationForm Contoller Unit Tests:', function() {

	beforeEach(function(done) {
		courseEvaluation = new CourseCommittee({
			courseCommitteeParticipants: 'Kyle Adam Zach Brian Brett',
			syllabusReflectCurrentContent: false,
			droppedTopics: true,
			addedTopics: false,
			textbookWorkingWell: false,
			changesRequiredForNextAcademicYear: true,
			newBooksToBeEvaluated: true,
			bookMapWellToSyllabus: false,
			otherEvaluationsIndicateIssues: true,
			didStudentsMasterMaterial: false,
			problemsWithKnowledgeInKeyConcepts: false,
			prereqsStillAppropriate: true,
			satisfyNeedsOfFollowupCourses: false,
			sectionIActionsRecommendations: 'This is test for sectionI',
			sectionIIActionsRecommendations: 'This is test for sectionII',
			recommendationsForCourseImprovement: 'Drop the course',
			recommendationsToCENProgramGovernance: 'Give me a raise',
			sectionIIIRecommendationsComments: 'This is test for section III'
		});

			// console.log('util.inspect: '+util.inspect(courseEvaluation));

			req = httpMocks.createRequest({
				method: 'POST',
				url: '/courseCommitteeEvaluation',
				body: courseEvaluation
			});

			res  = httpMocks.createResponse();
			res2 = httpMocks.createResponse();
			res3 = httpMocks.createResponse();
			done();
	});

	describe('CourseCommitteeEvaluationForm create Tests', function() {


		it('should create a new CourseCommitteeEvaluationForm', function(done) {
			controller.create(req,res, function() {
				console.log('inside the return function')
				var code = JSON.parse(res._getStatusCode());
				var data = JSON.parse(res._getData());
				data.prereqsStillAppropriate.should.equal(courseEvaluation.prereqsStillAppropriate);
				code.should.equal(200);
				done();
			});
		});

       	it('should fail to create a new form without courseCommitteeParticipants.', function(done) {
			courseEvaluation.courseCommitteeParticipants = '';
		 	req.body = courseEvaluation;
		 	controller.create(req,res, function() {
		 		var code = JSON.parse(res._getStatusCode());
		 		code.should.equal(400);
		 		done();
		 	});
       	});
       	it('should fail to create a new form without droppedTopics.', function(done) {
			courseEvaluation.droppedTopics = null,
		 	req.body = courseEvaluation;
		 	controller.create(req,res, function() {
		 		var code = JSON.parse(res._getStatusCode());
		 		code.should.equal(400);
		 		done();
		 	});
       	});
       	it('should fail to create a new form without addedTopics.', function(done) {
			courseEvaluation.addedTopics = null,
		 	req.body = courseEvaluation;
		 	controller.create(req,res, function() {
		 		var code = JSON.parse(res._getStatusCode());
		 		code.should.equal(400);
		 		done();
		 	});
       	});
       	it('should fail to create a new form without textbookWorkingWell.', function(done) {
			courseEvaluation.textbookWorkingWell = null,
		 	req.body = courseEvaluation;
		 	controller.create(req,res, function() {
		 		var code = JSON.parse(res._getStatusCode());
		 		code.should.equal(400);
		 		done();
		 	});
       	});
       	it('should fail to create a new form without otherEvaluationsIndicateIssues.', function(done) {
			courseEvaluation.otherEvaluationsIndicateIssues = null,
		 	req.body = courseEvaluation;
		 	controller.create(req,res, function() {
		 		var code = JSON.parse(res._getStatusCode());
		 		code.should.equal(400);
		 		done();
		 	});
       	});

       	it('should fail to create a new form without sectionIActionsRecommendations.', function(done) {
			courseEvaluation.sectionIActionsRecommendations = '',
		 	req.body = courseEvaluation;
		 	controller.create(req,res, function() {
		 		var code = JSON.parse(res._getStatusCode());
		 		code.should.equal(400);
		 		done();
		 	});
       	});

       	it('should fail to create a new form without sectionIIActionsRecommendations.', function(done) {
			courseEvaluation.sectionIIActionsRecommendations = '',
		 	req.body = courseEvaluation;
		 	controller.create(req,res, function() {
		 		var code = JSON.parse(res._getStatusCode());
		 		code.should.equal(400);
		 		done();
		 	});
       	});

     });

	describe('CourseCommitteeEvaluationForm update Tests', function() {
		it('should successfully update a already created form', function(done) {
	 		controller.create(req,res, function() {
				var code = JSON.parse(res._getStatusCode());
				var data = JSON.parse(res._getData());
				var id = data._id;
				data.prereqsStillAppropriate.should.equal(courseEvaluation.prereqsStillAppropriate);
					CourseCommittee.findById(id).exec(function(err, courseComittee1) {
	 					req.courseCommittee = courseComittee1;
	 					req.body = {courseCommitteeParticipants : 'test course committee'};
	 					controller.update(req,res2, function() {
							data = JSON.parse(res2._getData());
	 						code = res2._getStatusCode();
	 						code.should.equal(200);
	 						data.courseCommitteeParticipants.should.equal('test course committee');
	 						done();
	 					});
	 				});
			});
		});
/*
		it('should fail to update a already created form', function(done) {
	 		controller.create(req,res, function() {
				var code = JSON.parse(res._getStatusCode());
				var data = JSON.parse(res._getData());
				var id = data._id;
				data.prereqsStillAppropriate.should.equal(courseEvaluation.prereqsStillAppropriate);
				CourseModel.findById(courseEvaluation.courseOutcomeAssessmentForm).exec(function(err, course) {
					course.courseNumber.should.equal(courseModel1.courseNumber);
					code.should.equal(200);
					CourseCommittee.findById(id).exec(function(err, courseComittee1) {
	 					req.courseCommittee = courseComittee1;
	 					req.body = {courseCommitteeParticipants : ''};
	 					controller.update(req,res2, function() {
							data = JSON.parse(res2._getData());
	 						code = res2._getStatusCode();
	 						code.should.equal(400);
	 						done();
	 					});
	 				});
				});
			});
		});
	 			
*/
	 	

	// 	it('should fail to update without correct data', function(done) {
	// 		controller.create(req,res, function() {
	// 			var code = JSON.parse(res._getStatusCode());
	// 			code.should.equal(200);
	// 			var data = JSON.parse(res._getData());
	// 			var id = data._id;
	// 			CourseCommittee.findById(id).exec(function(err, courses) {
	// 				req.courseComittee1 = courses;
	// 				req.body = {description : 'this description doesn\'t exist!'};
	// 				controller.update(req,res2, function() {
	// 					code = res2._getStatusCode();
	// 					code.should.equal(400);
	// 					done();
	// 				});
	// 			});
	// 		});
	// 	});


	});

	// describe('CourseCommitteeEvaluationForm delete Tests', function() {
	// 	it('should be able to delete a form that is already there', function(done) {
	// 		controller.create(req,res, function() {
	// 			var code = JSON.parse(res._getStatusCode());
	// 			code.should.equal(200);
	// 			var data = JSON.parse(res._getData());
	// 			var id = data._id;
	// 			CourseCommittee.findById(id).exec(function(err, courses) {
	// 				req.courseComittee1 = courses;
	// 				controller.delete(req,res2, function() {
	// 					code = res2._getStatusCode();
	// 					var data2 = JSON.parse(res2._getData());
	// 					data2.description.should.equal(data.description);
	// 					code.should.equal(200);
	// 					done();
	// 				});
	// 			});
	// 		});

	// 	});
	// });

	// describe('CourseCommitteeEvaluationForm Read Tests', function() {
	// 	it('should be able to generate a html string from the courseCommitteEvaluationForm html file.', function(done) {
	// 		var filename = __dirname + '/../../controllers/pdfModels/CourseCommitteeEvaluationForm.html';
	// 		fs.readFile(filename, function(err,data) {
	// 			should.not.exist(err);
	// 			var template = Handlebars.compile(data.toString());
	// 			var result = template(courseEvaluation);
	// 			done();
	// 		});
	// 	});	
		
	// });
	
	// describe('CourseCommitteeEvaluationForm findById Tests', function() {
	// 	it('should be able to find the correct object for the given id', function(done) {
	// 		controller.create(req,res, function() {
	// 			var code = JSON.parse(res._getStatusCode());
	// 			code.should.equal(200);
	// 			var data = JSON.parse(res._getData());
	// 			var id = data._id;

	// 			controller.courseCommitteeEvaluationByID(req, res2, function(err) {
	// 				should.not.exist(err);
	// 				done();
	// 			}, id);
	// 		});
	// 	});

	// 	it('should fail to find an object thats not created', function(done) {
	// 		var id = courseComittee1._id;
	// 		controller.courseCommitteeEvaluationByID(req, res2, function(err) {
	// 			should.exist(err);
	// 			done();
	// 		}, id);
	// 	});




	// });
	afterEach(function(done) {
		CourseCommittee.remove().exec();
		CourseModel.remove().exec();
		done();
	});

});