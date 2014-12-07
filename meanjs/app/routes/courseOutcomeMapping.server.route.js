'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	coursesMapping = require('../../app/controllers/courseOutcomeMapping'),
	outcomes = require('../../app/controllers/outcomes');

module.exports = function(app) {
	// Article Routes
	app.route('/courseOutcomeMapping')
		.get(coursesMapping.generate);

};