'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	courses = require('../../app/controllers/courses');

module.exports = function(app) {
	// Article Routes
	app.route('/courses')
		.post(users.requiresLogin, courses.create)
		.get(users.requiresLogin, courses.list);

	app.route('/courses/:courseId')
		.get(users.requiresLogin, courses.read)
		.put(users.requiresLogin, courses.update)
		.delete(users.requiresLogin, courses.remove);

	app.route('/courses/:courseId/outcomes')
		.post(courses.addOutcome);

	// Finish by binding the article middleware
	app.param('courseId', courses.courseByID);
};