'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Course = mongoose.model('Course'),
	users = require('../../app/controllers/users'),
	request = require('supertest');

/**
 * Globals
 */
var user, user2, course;

/**
 * Unit tests
 */
describe('User server controller Unit Tests:', function() {
	before(function(done) {
		course = new Course({
			courseID: 'Boooppin'
		});

		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			provider: 'local',
			courses: [course]
		});

		user.save();

		done();
	});

	describe('Method getCourses', function() {
		it('Get on users should call getCourses and return correct array', function(done) {
			var url = 'http://someurl.com';
			request(url)
				.get('/users')
				.send(user)
				.end(function(err, res) {
					if(err) {
						throw err;
					}
					console.log(res.status);
					res.status.should.equal('400');
					done();
				})
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function(done) {
			user.save();
			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without first name', function(done) {
			user.firstName = '';
			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	after(function(done) {
		User.remove().exec();
		done();
	});
});