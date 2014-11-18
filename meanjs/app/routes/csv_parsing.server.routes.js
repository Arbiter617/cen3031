'use strict';


/**
 * Module dependencies.
 * This file currently does not do any permissions checking. Anyone attempting
 * to use this will get all forms that have been created.
 */
var csv_parsing = require('../../app/controllers/csv_parsing');

module.exports = function(app) {
	// Article Routes
	app.route('/csv_parsing')
		.post(csv_parsing.create);
};