
'use strict';

/**
* Module Dependencies
*/


var should = require('should'),
	mongoose = require('mongoose'),
	courseModel= mongoose.model('CourseOutcomeAssessmentForm'),
	request = require('supertest');


/**
* Globals
*/

var courseModel1, courseModel2, courseModel3fail, id;

/**
* Unit tests
*/


describe('Course Model Unit Tests:', function(){
	beforeEach(function(done)	{
		courseModel1 = new courseModel({
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
		courseModel2 = new courseModel({
			description: 'Second string describing the class',
			courseNumber: 2345,
			term: 'Fall 2014',
			courseTitle: 'COP3503',
			instructor: 'Professor Roytman',
			date: new Date(), //Same date concern as above
			descriptionOfInstrument: 'Second time describing instrument',
			numberOfStudents: 52,
			gradingScale: '0-10',
			averageScore: 75,
			scoreForAdequateOutcomeAchievement: 75,
			percentOfStudentsAchievingOutcomeAdequately: 87,
			averageLikertScaleValue: 3,
			instructorComments: 'No comments'

		});

		courseModel3fail = new courseModel({
			description: 123,
			courseNumber: 'This should be a number not a string, testing failure',
			term: 4,
			courseTitle: 'GEA2405',
			instructor: 'Dr. Jones',
			date: new Date(),
			descriptionOfInstrument: 'What does description of instrument mean?',
			numberOfStudents: 100,
			gradingScale: 100,
			averageScore: 100,
			scoreForAdequateOutcomeAchievement: 90,
			percentOfStudentsAchievingOutcomeAdequately: 100,
			averageLikertScaleValue: 'Testing for failure',
			instructorComments: 'I hope this works'
		});
		done();
	});	

	describe('Method Save', function() {
		it('should be able to save without problems', function(done){
			return courseModel1.save(function(err){
				should.not.exist(err);
				done();

			});
		});

		it('should fail to save courseModel3fail because of incorrect data type', function(done){
			return courseModel3fail.save(function(err){
				should.exist(err);
				done();
			});
		});
		
		it('should successfully delete courseModel2', function(done){
			courseModel.find({}, function(err, courses) {
				courses.should.have.length(1);
				courses[0].remove(function(err){
					should.not.exist(err);
					done();
				});
			});

		});

		it('should be able to show an error when try to save without description', function(done){
			courseModel1.description = '';

			return courseModel1.save(function(err){
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without courseNumber', function(done){
			courseModel1.courseNumber = null;

			return courseModel1.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without term', function(done){
			courseModel1.term = '';

			return courseModel1.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without courseTitle', function(done){
			courseModel1.courseTitle = '';

			return courseModel1.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without instructor', function(done){
			courseModel1.instructor = '';

			return courseModel1.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without description of instrument', function(done){
			courseModel1.descriptionOfInstrument = '';

			return courseModel1.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without number of students', function(done){
			courseModel1.numberOfStudents = null;

			return courseModel1.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without gradingScale', function(done){
			courseModel1.gradingScale = null;

			return courseModel1.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without averageScore', function(done){
			courseModel1.averageScore= null;

			return courseModel1.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without scoreForAdequateOutcomeAchievement', function(done){
			courseModel1.scoreForAdequateOutcomeAchievement = null;

			return courseModel1.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without percentOfStudentsAchievingOutcomeAdequately', function(done){
			courseModel1.percentOfStudentsAchievingOutcomeAdequately = null;

			return courseModel1.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without averageLikertScaleValue', function(done){
			courseModel1.averageLikertScaleValue = null;

			return courseModel1.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	describe('Multiple CourseOutcomeAssessmentForms', function() {
		it('should be able to save 2 different outcomes', function(done) {
			courseModel1.save(function(err){
				should.not.exist(err);
				courseModel2.save(function(err2) {
					should.not.exist(err2);
					done();
				});
			});
		});

		it('should be able to find the 2 saved outcomeForms', function(done) {
			courseModel.find({}, function(err,courses) {
				courses.should.have.length(2);
				should.not.exist(err);
				done();
			});
		});

		it('should be able to delete the 2 saved outcomeForms', function(done) {
			courseModel.find({}, function(err,courses) {
				courses.should.have.length(2);
				should.not.exist(err);
				courses[0].remove(function(err) {
					should.not.exist(err);
					courses[1].remove(function(err) {
						should.not.exist(err);
						done();
					});
				});
				
			});
		});
	});

	after(function(done){
		courseModel.remove().exec();
		done();
	});
});

