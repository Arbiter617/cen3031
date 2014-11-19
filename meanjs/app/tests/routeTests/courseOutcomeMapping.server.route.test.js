'use strict';

/**
 * Module dependencies.
 */

var should = require('should'),
	mongoose = require('mongoose'),
	request = require('supertest');



describe('/courseOutcomeMapping tests', function() {
		//3001 because thats the port that runs when grunt test is called.
		var url = 'http://localhost:3000';
		//Request is used to mock the front end calls.
		request = request(url);

		it('test courseOutcomeMapping', function(done) {
			request
				.get('/courseOutcomeMapping')
      			.end(function (err,res) {
      				//res.status.should.equal(200);
						done();
					});
			});
		});
