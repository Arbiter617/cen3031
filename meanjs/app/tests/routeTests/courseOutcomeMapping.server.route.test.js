'use strict';

/**
 * Module dependencies.
 */

var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Outcome = mongoose.model('Outcome'),
	OutcomePrototype = mongoose.model('OutcomePrototypes'),
	fs = require('fs'),
    XLSX = require('xlsx'),
	Course = mongoose.model('Course'),
	request = require('supertest');

var user, user2, course2, course3, course4, course5, course6, outcome,
	outcome2, outcome3, outcome4, outcome5, outcome6, outcomePrototype, req, res, outcomeArray = [];

describe('Course Outcome Mapping Route Functional Tests', function(){
	beforeEach(function(done){
		user2 = new User({
			firstName: 'Brian',
			lastName: 'Roytman',
			displayName: 'Brian Roytman',
			email: 'brian.roytman@ufl.edu',
			username: 'broyt',
			password: 'goodluck'
		});

		user2.save(function() {
			outcome2 = new Outcome({
				outcomeID: 'A',
				outcomeName: 'a. an ability to apply knowledge of mathematics, science, and engineering',
				user: user2
			});
			outcome2.save(function() {
				outcomeArray.push(outcome2);
				outcome3 = new Outcome({
					outcomeID: 'B',
					outcomeName: 'b. an ability to design and conduct experiments, as well as to analyze and interpret data',
					user: user2
				});
				outcome3.save(function(){
					outcomeArray.push(outcome3);
					outcome4 = new Outcome({
						outcomeID: 'C',
						outcomeName: 'c. an ability to design a system, component, or process to meet desired needs within realistic constraints such as economic, environmental, social, political, ethical, health and safety, ',
						user: user2
					});
					outcome4.save(function(){
						outcomeArray.push(outcome4);
						outcome5 = new Outcome({
							outcomeID: 'D',
							outcomeName: 'd. an ability to function on multidisciplinary teams',
							user: user2
						});
						outcome5.save(function(){
							outcomeArray.push(outcome5);
							outcome6 = new Outcome({
								outcomeID: 'E',
								outcomeName: 'e. an ability to identify, formulate, and solve engineering problems',
								user: user2
							});
							outcome6.save(function(){
								outcomePrototype = new OutcomePrototype({
									elements: outcomeArray
								});
								outcomePrototype.save(function() {
								course2 = new Course({
									courseID: 'COP3530',
									courseName: 'Data Structures and Algorithms',
									courseTerm: 'Spring',
									courseYear: '2015',
									outcomes: outcomeArray
								});
								course2.save(function(){
									outcomeArray.pop();
									course3 = new Course({
										courseID: 'CIS4204',
										courseName: 'Ethical Hacking and Penetration Testing',
										courseTerm: 'Spring',
										courseYear: '2015',
										outcomes: outcomeArray
									});
									course3.save(function(){
										outcomeArray.pop();
										course4 = new Course({
											courseID: 'COP3502',
											courseName: 'Java Programming Fundamentals I',
											courseTerm: 'Spring',
											courseYear: '2015',
											outcomes: outcomeArray
										});
										course4.save(function(){
											outcomeArray.push(outcome5);
											outcomeArray.push(outcome6);
											course5 = new Course({
												courseID: 'COP3503',
												courseName: 'Java Programming Fundamentals II',
												courseTerm: 'Spring',
												courseYear: '2015',
												outcomes: outcomeArray
											});
											course5.save(function(){
												outcomeArray.pop();
												course6 = new Course({
													courseID: 'CEN3031',
													courseName: 'Intro to Software Engineering',
													courseTerm: 'Spring',
													courseYear: '2015',
													outcomes: outcomeArray
												});
												course6.save(function(){
													done();
													req = {};
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
		});	
	});

	describe('/courseOutcomeMapping tests', function() {
		//3001 because thats the port that runs when grunt test is called.
		var url = 'http://localhost:3001';
		 //Request is used to mock the front end calls.
		 request = request(url);

		it('Should successfully create a new outcome mapping form', function(done) {
			request
				.get('/courseOutcomeMapping')
      			.end(function (err,res) {
      				should.not.exist(err);
      				res.status.should.equal(200);
					done();
				});
		});
	});
	
	afterEach(function(done) {
		User.remove().exec();
		Course.remove().exec();
		Outcome.remove().exec();
		OutcomePrototype.remove().exec();
		done();
	});		
});
