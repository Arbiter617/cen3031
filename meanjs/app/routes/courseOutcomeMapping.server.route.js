'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	courses = require('../../app/controllers/courseOutcomeMapping'),
	outcomes = require('../../app/controllers/outcomes');

module.exports = function(app) {
	// Article Routes
	app.route('/courseOutcomeMapping')
		.get(courses.generate);

};