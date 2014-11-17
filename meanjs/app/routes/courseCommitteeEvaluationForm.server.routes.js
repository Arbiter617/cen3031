'use strict';

/**
 * Module dependencies.
 * This file currently does not do any permissions checking. Anyone attempting
 * to use this will get all forms that have been created.
 */
var courseCommitteeEvaluation = require('../../app/controllers/courseCommitteeEvaluationForm');

module.exports = function(app) {
	// Article Routes
	app.route('/courseCommitteeEvaluation')
		.get(courseCommitteeEvaluation.list)
		.post(courseCommitteeEvaluation.create);

	app.route('/courseCommitteeEvaluation/:courseCommitteeEvaluationId')
		.get(courseCommitteeEvaluation.read)
		.put(courseCommitteeEvaluation.update)
		.delete(courseCommitteeEvaluation.delete);

	// Finish by binding the article middleware
	app.param('courseCommitteeEvaluationId', courseCommitteeEvaluation.courseCommitteeEvaluationByID);
};