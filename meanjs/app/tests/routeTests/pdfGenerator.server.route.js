'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	CourseModel= mongoose.model('CourseOutcomeAssessmentForm'),
	Course = mongoose.model('Course'),
	Outcome = mongoose.model('Outcome'),
	OutcomeEvaluation = mongoose.model('OutcomeEvaluation'),
	User = mongoose.model('User'),
	CourseCommittee = mongoose.model('CourseCommitteeEvaluationForm'),
	fs = require('fs'),
	Handlebars = require('handlebars'),
	request = require('supertest');

/**
 * Globals, id later becomes the mongodb id of a document so that it can
 * be used in id specific routes.
 */
var courseModel1, courseEvaluation, id, id2, outcome1, outcome2, outcome3, outcomeArray,
	outcomeEvals1, outcomeEvals2, outcomeEvals3, user, course;

/**
 * Functional tests.
 * I wrote tests that should pass. The remaining tests that need to be written are those
 * that should throw an error. Like passing in a garbage id causes an error to be thrown.
 * Or passing in a garbage course causes an error. Stuff like that. Will be similar in the controller.
 */
describe('PDFGenerator Route Functional Tests:', function() {

	before(function(done) {
		
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		outcomeArray = [];
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
		});

		
		outcomeEvals1 = new OutcomeEvaluation({
			instrumentsChosen: 'satisfactory',
			likertScaleThresholds: 'satisfactory',
			sampleGradedStudentWork: 'satisfactory',
			percentageOfStudentsAchievingOutcome: 'satisfactory',
			averageLikertValue: 'satisfactory',
			achievementOfOutcome: 'satisfactory',
			suggestedImprovements: 'none'
		});
		outcomeEvals2 = new OutcomeEvaluation({
			instrumentsChosen: 'unsatisfactory',
			likertScaleThresholds: 'satisfactory',
			sampleGradedStudentWork: 'unsatisfactory',
			percentageOfStudentsAchievingOutcome: 'satisfactory',
			averageLikertValue: 'unsatisfactory',
			achievementOfOutcome: 'satisfactory',
			suggestedImprovements: 'lots of stuff'
		});
		outcomeEvals3 = new OutcomeEvaluation({
			instrumentsChosen: 'unsatisfactory',
			likertScaleThresholds: 'unsatisfactory',
			sampleGradedStudentWork: 'unsatisfactory',
			percentageOfStudentsAchievingOutcome: 'unsatisfactory',
			averageLikertValue: 'unsatisfactory',
			achievementOfOutcome: 'unsatisfactory',
			suggestedImprovements: 'ummmmmm'
		});

		user.save(function() {

			courseModel1.save(function() {
				outcomeEvals1.save(function() {
					outcome1 = new Outcome({
						outcomeID: 'a',
					outcomeName: 'Something',
					outcomeEvaluation: outcomeEvals1,
					outcomeAssessmentForm: courseModel1,
					user: user
				});
					courseEvaluation.save(function() {
					outcome1.save(function() {
						outcomeArray.push(outcome1);
						outcomeEvals2.save(function() {
							outcome2 = new Outcome({
								outcomeID: 'b',
								outcomeName: 'aksjdf',
								outcomeEvaluation: outcomeEvals2,
								outcomeAssessmentForm: courseModel1,
								user: user
							});
							outcome2.save(function() {
								outcomeArray.push(outcome2);
								outcomeEvals3.save(function() {
									outcome3 = new Outcome({
										outcomeID: 'g',
										outcomeName: 'fasdfad',
										outcomeEvaluation: outcomeEvals3,
										outcomeAssessmentForm: courseModel1,
										user: user
									});
									outcome3.save(function() {
										outcomeArray.push(outcome3);
										course = new Course({
											courseID: '3101',
											courseName: 'Intro to Software',
											outcomes: outcomeArray,
											courseCommitteeEvaluationForm: courseEvaluation
										});
										course.save(function() {
											id = course._id;
											done();
										});
									});
								});
							});
					});
					});
				});
			});
		});
	});


	});


	describe('/courseCommitteeEvaluation tests', function() {
		//3001 because thats the port that runs when grunt test is called.
		var url = 'http://localhost:3001';
		//Request is used to mock the front end calls.
		request = request(url);

		

	describe('/committeePDF/:id tests', function() {
		//This test is weird. Can't really verify the pdf is created. 
		//Go to the /controllers/pdfs folder and verify that it has been created.
		//Manually delete all the generated pdfs. 
		it('should create a pdf form based on the courseEvaluation', function(done) {
			request
				.post('/committeePDF/' + id)
				.end(function (err,res) {
					res.body.should.equal(id.toString());
					res.status.should.equal(200);
					done();
				});

		});
	});

	describe('/outcomePDF tests', function() {

		it('should create a pdf form based on the courseOutcomeAssessmentForm', function(done) {
			var fileName = __dirname + '/../../controllers/pdfModels/CourseOutcomeAssessmentForm.html';
			fs.readFile(fileName, function(err,data) {
				var template = Handlebars.compile(data.toString());
				var result = template(courseModel1);
				request
					.post('/outcomePDF')
					.send({data: result, _id:'1234123412341235'})
					.end(function (err,res) {
						res.body.should.equal('1234123412341235');
						res.status.should.equal(200);
						done();
				});
			});
			
		});


	});

	
	});

	
	after(function(done) {
		CourseModel.remove().exec();
		OutcomeEvaluation.remove().exec(); 
		User.remove().exec();
		Outcome.remove().exec(); 
		CourseCommittee.remove().exec();
		Course.remove().exec();
		done();
	});

});