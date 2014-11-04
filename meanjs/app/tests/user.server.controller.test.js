'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	users = require('../../app/controllers/users'),
	Course = mongoose.model('Course');

/**
 * Globals
 */
var user, user2, course;

/**
 * Unit tests
 */
describe('User Controller Unit Tests:', function() {
	before(function(done) {
		course = new Course({
			courseID: 'Boooppin',
			courseName: 'cmon',
			outcomes: []
		});

		course.save();

		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			courses: [course],
			username: 'username',
			password: 'password',
			provider: 'local'
		});
		user2 = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local'
		});
		user.save();
		done();
	});
	
	describe('Course get', function() {
		it('Courses should return array of courses with correct values', function(done) {
			var req= {};
			req.user= user;

			var body;
			var res = {
	            jsonp: function(object) {
	            	object[0].courseID.should.equal(course.courseID);
	            	object[0].courseName.should.equal(course.courseName);
	            	object[0].outcomes.length.should.equal(0);
	            }
            };

			users.getCourses(req,res);
			done();
			
		});
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});