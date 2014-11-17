
'use strict';

/**
* Module Dependencies
*/


var should = require('should'),
	mongoose = require('mongoose'),
	CourseModel= mongoose.model('CourseOutcomeAssessmentForm'),
	CourseCommittee = mongoose.model('CourseCommitteeEvaluationForm');



/**
* Globals
*/

var courseModel1, courseEvaluation, id;

/**
* Unit tests
*/


describe('Course Committee Evaluation Unit Tests:', function(){
	beforeEach(function(done)	{
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

	describe('Method Save', function() {
		it('should be able to save without problems', function(done){
			return courseEvaluation.save(function(err){
				should.not.exist(err);
				done();

			});
		});
		
		it('should be able to show an error when try to save without description', function(done){
			courseEvaluation.description = '';
			return courseEvaluation.save(function(err){
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without committee participants', function(done){
			courseEvaluation.courseCommitteeParticipants = '';
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without answering questions', function(done){
			courseEvaluation.syllabusReflectCurrentContent = null;
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without answering questions', function(done){
			courseEvaluation.droppedTopics = null;
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without answering questions', function(done){
			courseEvaluation.addedTopics = null;
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without answering questions', function(done){
			courseEvaluation.textbookWorkingWell = null;
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without answering questions', function(done){
			courseEvaluation.changesRequiredForNextAcademicYear = null;
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without answering questions', function(done){
			courseEvaluation.newBooksToBeEvaluated = null;
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without answering questions', function(done){
			courseEvaluation.bookMapWellToSyllabus = null;
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without answering questions', function(done){
			courseEvaluation.otherEvaluationsIndicateIssues = null;
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without answering questions', function(done){
			courseEvaluation.didStudentsMasterMaterial = null;
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without answering questions', function(done){
			courseEvaluation.problemsWithKnowledgeInKeyConcepts = null;
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without answering questions', function(done){
			courseEvaluation.prereqsStillAppropriate = null;
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without answering questions', function(done){
			courseEvaluation.satisfyNeedsOfFollowupCourses = null;
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without sectionIActionsRecommendations', function(done){
			courseEvaluation.sectionIActionsRecommendations = '';
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without sectionIIActionsRecommendations', function(done){
			courseEvaluation.sectionIIActionsRecommendations = '';
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without recommendationsForCourseImprovement', function(done){
			courseEvaluation.recommendationsForCourseImprovement = '';
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without recommendationsToCENProgramGovernance', function(done){
			courseEvaluation.recommendationsToCENProgramGovernance = '';
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without sectionIIIRecommendationsComments', function(done){
			courseEvaluation.sectionIIIRecommendationsComments = '';
			return courseEvaluation.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	describe('Retrieving data from nested Schema', function() {
		it('should be able to return the outcome from the nested schema', function(done) {
			courseEvaluation.save(function(err) {
				should.not.exist(err);
				CourseCommittee.find({})
					.populate('courseOutcomeAssessmentForm')
					.exec( function(err,courses) {
						var util = require('util');
						courses.should.have.length(1);
						should.not.exist(err);
						courses[0].courseOutcomeAssessmentForm.courseNumber.should.equal(1234);
						courses[0].courseOutcomeAssessmentForm.averageScore.should.equal(82);
						done();
					});
			});
			
		});
	});

	afterEach(function(done) {
		CourseCommittee.remove().exec();
		CourseModel.remove().exec();
		done();
	});
});

