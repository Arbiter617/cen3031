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
<<<<<<< HEAD
		.post(pdfGenerator.generatePDF);
=======
		.post(pdfGenerator.generateOutcomePDF);
>>>>>>> fe0a46b7126652835ad6c000d3154bf9098e7ab4

	app.route('/committeePDF/:courseId')
		.post(pdfGenerator.getFile)
		.get(pdfGenerator.returnPDF);

	app.param('courseId', pdfGenerator.courseByID);
};