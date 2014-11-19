'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	//users = require('../../app/controllers/users'),
	Outcome = mongoose.model('Outcome'),
	fs = require('fs'),
	Course = mongoose.model('Course');

var user, user2, course2, course3, course4, course5, course6, outcome, outcome2, outcome3, outcome4, outcome5, outcome6, outcomeArray = [];

describe('Course Outcome Mapping Controller Unit Tests', function(){
	beforeEach(function(done){
		/*
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() {
			course = new Course({
				courseID: 'CourseID',
				courseName: 'CourseName',
				outcomes: outcomeArray
			});
			course.save();

			outcome = new Outcome({   		//HOW DO I ASSOCIATE AN OUTCOME WITH A SPECIFIC CLASS????
				outcomeID: 'OutcomeID',
				outcomeName: 'OutcomeName',
				user: user
			});
			outcome.save();

			done();
		};
		*/
		

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
								course2 = new Course({
									courseID: 'COP3530',
									courseName: 'Data Structures and Algorithms',
									outcomes: outcomeArray
								});
								course2.save(function(){
									outcomeArray.pop();
									course3 = new Course({
										courseID: 'CIS4204',
										courseName: 'Ethical Hacking and Penetration Testing',
										outcomes: outcomeArray
									});
									course3.save(function(){
										outcomeArray.pop();
										course4 = new Course({
											courseID: 'COP3502',
											courseName: 'Java Programming Fundamentals I',
											outcomes: outcomeArray
										});
										course4.save(function(){
											outcomeArray.push(outcome5);
											outcomeArray.push(outcome6);
											course5 = new Course({
												courseID: 'COP3503',
												courseName: 'Java Programming Fundamentals II',
												outcomes: outcomeArray
											});
											course5.save(function(){
												outcomeArray.pop();
												course6 = new Course({
													courseID: 'CEN3031',
													courseName: 'Intro to Software Engineering',
													outcomes: outcomeArray
												});
												course6.save(function(){
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
	});

	describe('JSON 2 XLS', function() {
		it('Should generate XLS from Course and Outcome JSON', function(done) {
			
			Course.find({}, {_id: 0}).populate('outcomes').exec(function(err, courses) {
				if (err) { 
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					//courses = courses.toObject();
					//delete outcomes["_id"];
					//delete outcomes["__v"];
					for(var i = 0; i < courses.length; i++)
					{	
						for(var j = 0; j < courses[i].outcomes.length; j++) {
							courses[i].outcomes[j] = courses[i].outcomes[j].outcomeID;
						}

					}

					var json2xls = require('json2xls');
					var stringifyOutcome = JSON.stringify(courses, null, '\t');
					var parseFinalOutcome = JSON.parse(stringifyOutcome);

					fs.writeFileSync('./courseMappingControllerTestData.xls', json2xls(parseFinalOutcome), 'binary');
					

					done();
				}
			});
		});

	});


	afterEach(function(done) {
		User.remove().exec();
		Course.remove().exec();
		Outcome.remove().exec();
		done();
	});		
});	