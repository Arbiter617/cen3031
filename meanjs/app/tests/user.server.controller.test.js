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
var user, user2, course, course2;

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
		course2 = new Course({
			courseID: 'getit',
			courseName: 'boi',
			outcomes: []
		});
		course.save();
		course2.save();
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
			courses: [course, course2],
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
	describe('User update ', function() {
		it('Courses added ', function(done) {
			var req= {};
			req.user= user;
			req.body={};
			req.body.courses= [course,course2];
			req.login = function(){return true;}
			var res = {
	            jsonp: function(object) {
	            	object[0].courseID.should.equal(course.courseID);
	            	object[0].courseName.should.equal(course.courseName);
	            	object[0].outcomes.length.should.equal(0);
	            	object[1].courseID.should.equal(course2.courseID);
	            	object[1].courseName.should.equal(course2.courseName);
	            	object[1].outcomes.length.should.equal(0);
	            }
            };

			users.update(req,res);
			done();
			
		});
		it('Courses Removed', function(done){
			var req= {};
			req.user= user;
			req.course = course2;
			var res = {
	            jsonp: function(object) {

	            }
            };

			users.removeCourse(req,res);
			done();
			
		});
	});
	after(function(done) {
		User.remove().exec();
		done();
	});
});