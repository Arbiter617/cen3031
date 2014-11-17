'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	CourseModel= mongoose.model('CourseOutcomeAssessmentForm'),
	CourseCommittee = mongoose.model('CourseCommitteeEvaluationForm'),
	request = require('supertest');

/**
 * Globals, id later becomes the mongodb id of a document so that it can
 * be used in id specific routes.
 */
var courseModel1, courseEvaluation, id, id2;

/**
 * Functional tests.
 * I wrote tests that should pass. The remaining tests that need to be written are those
 * that should throw an error. Like passing in a garbage id causes an error to be thrown.
 * Or passing in a garbage course causes an error. Stuff like that. Will be similar in the controller.
 */
describe('CourseCommitteeEvaluationForm Route Functional Tests:', function() {

	before(function(done) {
		courseModel1 = new CourseModel({
			description: 'First string describing the class...software engineering',
			courseNumber: 1234,
			term: 'Fall 2014',
			courseTitle: 'CEN3031',
			instructor: 'Professor Dobra',
			date: new Date(), // Is this proper syntax for
			descriptionOfInstrument: 'String describing instrument..whatever this means',
			numberOfStudents: 45,
			gradingScale: '0-10',
			averageScore: 82,
			scoreForAdequateOutcomeAchievement: 70,
			percentOfStudentsAchievingOutcomeAdequately: 95,
			averageLikertScaleValue: 4,
			instructorComments: 'Room for instructor comments.'
		});

		courseModel1.save(function() {
			courseEvaluation = new CourseCommittee({
				courseCommitteeParticipants: 'Kyle Adam Zach Brian Brett',
				description: 'This is a test',
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
				courseOutcomeAssessmentForm: courseModel1
			});
			done();
		});

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
						courses.description.should.equal(courseEvaluation.description);
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

		//This test is weird. Can't really verify the pdf is created. 
		//Go to the /controllers/pdfs folder and verify that it has been created.
		//Manually delete all the generated pdfs. 

		it('should create a pdf form based on the courseEvaluation', function(done) {
			request
				.get('/courseCommitteeEvaluation/' + id2)
				.end(function (err,res) {
					res.status.should.equal(200);
					done();
				});
		});
		
		//This test will need to be updated if we fix thte sorting of the get operation
		it('should successfully update a form', function(done) {
			courseEvaluation.description = 'I am newly updated.';
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
							body[0].description.should.equal('I am newly updated.');
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
		CourseModel.remove().exec();
		CourseCommittee.remove().exec();
		done();
	});

});