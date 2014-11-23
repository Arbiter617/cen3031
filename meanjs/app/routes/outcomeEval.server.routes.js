'use strict';

var outcomeEval = require('../../app/controllers/outcomeEval');

module.exports = function(app) {
	// Article Routes
	app.route('/outcomeEval')
		.post(outcomeEval.create);
};