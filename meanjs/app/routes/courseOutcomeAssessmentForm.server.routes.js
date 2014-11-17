'use strict';

/**
 * Module dependencies.
 * This file currently does not do any permissions checking. Anyone attempting
 * to use this will get all forms that have been created.
 */
var courseOutcomeAssessment = require('../../app/controllers/courseOutcomeAssessmentForm');

module.exports = function(app) {
	// Article Routes
	app.route('/courseOutcomeAssessment')
		.get(courseOutcomeAssessment.list)
		.post(courseOutcomeAssessment.create);

	app.route('/courseOutcomeAssessment/:courseOutcomeAssessmentId')
		.get(courseOutcomeAssessment.read)
		.put(courseOutcomeAssessment.update)
		.delete(courseOutcomeAssessment.delete);

	// Finish by binding the article middleware
	app.param('courseOutcomeAssessmentId', courseOutcomeAssessment.courseOutcomeAssessmentByID);
};