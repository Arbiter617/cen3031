'use strict';

/**
 * Module dependencies.
 * This file currently does not do any permissions checking. Anyone attempting
 * to use this will get all forms that have been created.
 */
var pdfGenerator = require('../../app/controllers/pdfGenerator');

module.exports = function(app) {
	// Article Routes
	app.route('/outcomePDF/:outcomeAssessmentId')
		.post(pdfGenerator.getOutcomeFile)
		.get(pdfGenerator.returnPDF);

	app.route('/committeePDF/:courseId')
		.post(pdfGenerator.getCommitteeFile)
		.get(pdfGenerator.returnPDF);

	app.param('courseId', pdfGenerator.courseByID);
	app.param('outcomeAssessmentId', pdfGenerator.outcomeAssessmentByID);
};