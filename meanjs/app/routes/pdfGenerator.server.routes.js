'use strict';

/**
 * Module dependencies.
 * This file currently does not do any permissions checking. Anyone attempting
 * to use this will get all forms that have been created.
 */
var pdfGenerator = require('../../app/controllers/pdfGenerator');

module.exports = function(app) {
	// Article Routes
	app.route('/outcomePDF')
		.get(pdfGenerator.generatePDF);

	app.route('/committeePDF/:courseId')
		.get(pdfGenerator.getFile);

	app.param('courseId', pdfGenerator.courseByID);
};