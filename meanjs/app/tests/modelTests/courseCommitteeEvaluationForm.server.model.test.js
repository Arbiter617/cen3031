
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
		});
		done();
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

	afterEach(function(done) {
		CourseCommittee.remove().exec();
		done();
	});
});

