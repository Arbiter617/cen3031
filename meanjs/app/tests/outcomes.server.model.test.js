'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Outcome = mongoose.model('Outcome');

/**
 * Globals
 */
var user, outcome;

/**
 * Unit tests
 */
describe('Outcome Model Unit Tests:', function() {
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
			outcome = new Outcome({
				outcomeID: 'OutcomeID',
				outcomeName: 'OutcomeName',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save outcomes without problems', function(done) {
			return outcome.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without outcomeID', function(done) {
			outcome.outcomeID = '';

			return outcome.save(function(err) {
				should.exist(err);
				done();
			});
		});
		it('should be able to show an error when try to save without outcomeName', function(done) {
			outcome.outcomeName = '';

			return outcome.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Outcome.remove().exec();
		User.remove().exec();
		done();
	});
});