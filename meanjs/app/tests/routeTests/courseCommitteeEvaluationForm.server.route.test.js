'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	CourseModel= mongoose.model('CourseOutcomeAssessmentForm'),
	Outcome = mongoose.model('Outcome'),
	OutcomeEvaluation = mongoose.model('OutcomeEvaluation'),
	User = mongoose.model('User'),
	CourseCommittee = mongoose.model('CourseCommitteeEvaluationForm'),
	request = require('supertest');

/**
 * Globals, id later becomes the mongodb id of a document so that it can
 * be used in id specific routes.
 */
var courseModel1, courseEvaluation, id, id2, outcome1, outcome2, outcome3, outcomeArray,
	outcomeEvals1, outcomeEvals2, outcomeEvals3, user;

/**
 * Functional tests.
 * I wrote tests that should pass. The remaining tests that need to be written are those
 * that should throw an error. Like passing in a garbage id causes an error to be thrown.
 * Or passing in a garbage course causes an error. Stuff like that. Will be similar in the controller.
 */
describe('CourseCommitteeEvaluationForm Route Functional Tests:', function() {

	before(function(done) {
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
			sectionIIIRecommendationsComments: 'This is test for section III',
			courseOutcomeAssessmentForm: courseModel1,
			});
			done();
	});

	describe('/courseCommitteeEvaluation tests', function() {
		//3001 because thats the port that runs when grunt test is called.
		var url = 'http://localhost:3001';
		//Request is used to mock the front end calls.
		request = request(url);

		it('should save a new CourseCommitteeEvaluationForm', function(done) {
			request
				.post('/courseCommitteeEvaluation')
				.send(courseEvaluation)
      			.end(function (err,res) {
      				res.status.should.equal(200);
      				var courseEvaluationResponse = res.body;
      				CourseCommittee.findOne({courseCommitteeParticipants : 'Kyle Adam Zach Brian Brett'}, function (err, courses) {
						id2 = courses._id;
						courses.courseCommitteeParticipants.should.equal(courseEvaluation.courseCommitteeParticipants);
						done();
					});
			});
		});

		it('should return the newly created CourseCommitteeEvaluationForm', function(done) {
			request
				.get('/courseCommitteeEvaluation')
      			.end(function (err,res) {
      				res.status.should.equal(200);
      				var courseResponse = res.body;
      				courseResponse.length.should.equal(1);
      				courseResponse[0].courseCommitteeParticipants.should.equal(courseEvaluation.courseCommitteeParticipants);
      				courseResponse[0].sectionIActionsRecommendations.should.equal(courseEvaluation.sectionIActionsRecommendations);
      				done();
      			});
		});
		
	});

	describe('/courseCommitteeEvaluation/:id tests', function() {
		
		//This test will need to be updated if we fix thte sorting of the get operation
		it('should successfully update a form', function(done) {
			courseEvaluation.courseCommitteeParticipants = 'I am newly updated.';
			request
				.put('/courseCommitteeEvaluation/' + id2)
				.send(courseEvaluation)
				.end(function (err,res) {
					res.status.should.equal(200);
					request
						.get('/courseCommitteeEvaluation')
						.end(function(err2,res2) {
							var body = res2.body;
							body.length.should.equal(1);
							body[0].courseCommitteeParticipants.should.equal('I am newly updated.');
							done();
						});
				});
		});

		//Should successfully delete a form thus reducing the total number to two.
		it('should successfully delete a form', function(done) {
			request
				.delete('/courseCommitteeEvaluation/' + id2)
				.end(function (err,res) {
					res.status.should.equal(200);
					request
						.get('/courseCommitteeEvaluation')
						.end(function(err2,res2) {
							var body = res2.body;
							body.length.should.equal(0);
							done();
						});
				});
		});

	});

	after(function(done) {
		CourseCommittee.remove().exec();
		done();
	});

});