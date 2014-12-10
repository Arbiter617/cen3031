'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Outcome = mongoose.model('Outcome'),
	fs = require('fs'),
	controller = require('../../controllers/DataAnalytics'),
    XLSX = require('xlsx'),
	Course = mongoose.model('Course'),
	CourseModel= mongoose.model('CourseOutcomeAssessmentForm'),
	OutcomeEvaluation = mongoose.model('OutcomeEvaluation'),
	CourseCommittee = mongoose.model('CourseCommitteeEvaluationForm');


var user, user2, course, course2, course3, course4, course5, course6, outcome1, id, courseModel2,
	outcome2, outcome3, outcome4, outcome5, outcome6, req, res, courseModel1, outcomeArray = [];

describe('Data Analytics Controller Unit Test', function(){
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
			courseNumber: '1234',
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
		courseModel2 = new CourseModel({
			courseNumber: '1234',
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
			averageLikertScaleValue: 2,
			instructorComments: 'Room for instructor comments.'
		});
		
	

	

		user.save(function() {
			courseModel2.save(function() {
			courseModel1.save(function() {
				outcome1 = new Outcome({
					outcomeID: 'a',
					outcomeName: 'Something',
					outcomeAssessmentForm: courseModel1,
					user: user
				});
				outcome1.save(function() {
					outcomeArray.push(outcome1);
					outcome2 = new Outcome({
						outcomeID: 'b',
						outcomeName: 'aksjdf',
						outcomeAssessmentForm: courseModel1,
						user: user
					});
					outcome2.save(function() {
						outcomeArray.push(outcome2);
						outcome3 = new Outcome({
							outcomeID: 'g',
							outcomeName: 'fasdfad',
							outcomeAssessmentForm: courseModel2,
							user: user
						});
						outcome3.save(function() {
							outcomeArray.push(outcome3);
							course = new Course({
								courseID: '3101',
								courseName: 'Intro to Software',
								courseTerm: 'Fall',
								courseYear: '2014',
								outcomes: outcomeArray
										
							});
							course.save(function() {
								course2 = new Course({
									courseID: '3101f',
									courseName: 'Intro to Softwareasdf',
									courseTerm: 'Spring',
									courseYear: '2015',
									outcomes: outcomeArray
								});
								course2.save(function() {
									course3 = new Course({
										courseID: 'aksd;ljf',
										courseName: 'kasjdf;aksl',
										courseTerm: 'Spring',
										courseYear: '2015',
										outcomes: outcomeArray
									});
									course3.save(function() {
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

	describe('DataAnalytics', function() {
		it('Should Create Goddamn graphs', function(done) {
			var req = {};
			var res = {
				done: done,
				statusCode: 200,
				status: function(value) {
					this.statusCode = value;
				},
				jsonp: function(object1) {
					this.statusCode.should.equal(200);
					this.done();
				}
			};
			controller.dataAnalytics(req,res);
		});

	});


	afterEach(function(done) {
		CourseModel.remove().exec();
		OutcomeEvaluation.remove().exec(); 
		User.remove().exec();
		Outcome.remove().exec(); 
		CourseCommittee.remove().exec();
		Course.remove().exec();
		done();
	});		
});	