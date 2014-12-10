'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Course = mongoose.model('Course'),
	Outcome = mongoose.model('Outcome');

/**
 * Globals
 */
var user, course;

/**
 * Unit tests
 */
describe('Course Model Unit Tests:', function() {
	beforeEach(function(done) {
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
				courseTerm: 'CourseTerm',
				courseYear: 'courseYear',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save outcomes without problems', function(done) {
			return course.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without courseID', function(done) {
			course.courseID = '';

			return course.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should be able to show an error when try to save without courseName', function(done) {
			course.courseName = '';

			return course.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should be able to throw an error when trying to save without courseTerm', function(done){
			course.courseTerm = '';

			return course.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should be able to throw an error when trying to save without courseYear', function(done){
			course.courseYear = '';

			return course.save(function(err){
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Course.remove().exec();
		Outcome.remove().exec();
		User.remove().exec();
		done();
	});
});