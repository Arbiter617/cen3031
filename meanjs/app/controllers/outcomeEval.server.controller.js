'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	OutcomeEvaluation = mongoose.model('OutcomeEvaluation'),
	_ = require('lodash');

exports.create = function(req, res) {
	var outcomeEval = new OutcomeEvaluation(req.body);
	outcomeEval.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(outcomeEval);
		}
	});
};
