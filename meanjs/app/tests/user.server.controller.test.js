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
			firstName: 'Full1',
			lastName: 'Name1',
			displayName: 'Full Name1',
			email: 'test1@test.com',
			courses: [course, course2],
			username: 'username1',
			password: 'password1',
			provider: 'local'
		});
		user.save();
		user2.save();
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
			req.login = function(user, func){
							func(false); 
							return true;
						}
			var res = {
	            jsonp: function(object) {
	            	object.courses[0].should.equal(course._id);
	            	object.courses[1].should.equal(course2._id);
	            }
            };

			users.update(req,res);
			done();
			
		});
		
		it('Courses Removed', function(done){
			var req= {};
			req.user= user2;
			req.course = course;
			var res = {
	            jsonp: function(object) {
	            	//object.courses.length.should.equal(1);
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