'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	courses = require('../../../app/controllers/courses'),
	Course = mongoose.model('Course'),
	Outcome = mongoose.model('Outcome'),
	OutcomeEvaluation = mongoose.model('OutcomeEvaluation'),
	CourseCommitteeEvaluationForm = mongoose.model('CourseCommitteeEvaluationForm');

/**
 * Globals
 */
var user, user2, course, course2, evalForm, outcome, outcomeEval;

/**
 * Unit tests
 */
describe('User Controller Unit Tests:', function() {
	before(function(done) {
		outcome = new Outcome({
			outcomeID: "a",
			outcomeName: "name"
		});

		course = new Course({
			courseID: 'Boooppin',
			courseName: 'cmon',
			outcomes: [outcome]
		});

		evalForm = {
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
			sectionIIIRecommendationsComments: 'This is test for section III'
		};

		outcomeEval = new OutcomeEvaluation({
			instrumentsChosen: "instruments",
			likertScaleThresholds: "thresholds",
			sampleGradedStudentWork: "sampleGraded",
			percentageOfStudentsAchievingOutcome: "percentageOfstudenet",
			averageLikertValue: "avkg like",
			achievementOfOutcome: "achievement ",
			suggestedImprovements: "suggestedImprovements"
		});

		outcome.save();
		course.save();

		outcome.outcomeEvaluation = outcomeEval;

		done();
	});
	
	describe('Submit Form ', function() {
		it('submit eval form', function(done) {
			var req = {};
			req.course = course;

			var reqCourse = {
				courseID: 'Boooppin',
				courseName: 'cmon',
				outcomes: [outcome],
				courseCommitteeEvaluationForm: evalForm
			};

			req.body = reqCourse;

			var res = {
	            jsonp: function(object) {
	            	done();
	            }
            };

			//courses.submitForm(req, res);
			
		});

		it('submit outcome evals', function(done) {
			var req = {};
			req.course = course;

			var o = {
				outcomeName: outcome.outcomeName,
				outcomeID: outcome.outcomeID,
				outcomeEvaluation: outcomeEval
			};

			var reqCourse = {
				courseID: 'Boooppin',
				courseName: 'cmon',
				outcomes: [o],
				courseCommitteeEvaluationForm: evalForm
			};

			req.body = reqCourse;

			var res = {
	            jsonp: function(object) {
	            	console.log(object);
	            	//outcome in db should have an outcome evaluation form
	            	Outcome.find().exec(function(err, outcomes) {
	            		outcomes[0].outcomeEvaluation.should.notEqual('');
	            		done();
	            	});

	            	//OutcomeEvaluation.find().exec(function(err, outcomeEvaluation))
	            }
            };

			courses.submitForm(req, res);
		});
	});

	after(function(done) {
		Outcome.remove().exec();
		Course.remove().exec();
		CourseCommitteeEvaluationForm.remove().exec();
		done();
	});
});