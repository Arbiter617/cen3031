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
		//.post(users.requiresLogin, courses.create)
		.get(courses.generate);

	//app.route('/courses/:courseId')
		//.get(users.requiresLogin, courses.read)
		//.put(users.requiresLogin, courses.update)
		//.delete(users.requiresLogin, courses.remove);

	// Finish by binding the article middleware
	//app.param('courseId', courses.courseByID);
};