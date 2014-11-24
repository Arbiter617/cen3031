'use strict';

var outcomeEval = require('../../app/controllers/outcomeEval');

module.exports = function(app) {
	// Article Routes
	app.route('/outcomeEval')
		.post(outcomeEval.create);

	app.route('/outcomeEval/:outcomeEvalId')
		.get(outcomeEval.read);

	app.param('outcomeEvalId', outcomeEval.outcomeEvalByID);
};