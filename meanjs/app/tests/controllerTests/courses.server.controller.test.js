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
	CourseModel= mongoose.model('CourseOutcomeAssessmentForm'),
	CourseCommittee = mongoose.model('CourseCommitteeEvaluationForm');

/**
 * Globals
 */
var user, user2, course, course2, evalForm, outcome, outcomeEval;

var courseModel1, courseEvaluation, id, id2, outcome1, outcome2, outcome3, outcomeArray,
	outcomeEvals1, outcomeEvals2, outcomeEvals3, user, course;


/**
 * Unit tests
 */
describe('Courses Controller Unit Tests:', function() {
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
		/*
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
		*/
	});
	
	describe('Submit Form ', function() {
		it('submit eval form', function(done) {
			var req = {};
			req.course = course;
			/*
			var reqCourse = {
				courseID: 'Boooppin',
				courseName: 'cmon',
				outcomes: [outcome],
				courseCommitteeEvaluationForm: evalForm
			};
*/
			req.body = course;
/*
			var res = {
	            jsonp: function(object) {
	            	done();
	            }
            };
            */
            var res = {
	            jsonp: function(object) {
	            	return object;
	            }
            };

			courses.submitForm(req, res, done);

			
		});
/*
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

			courses.submitForm(req, res,done);
		});
*/

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