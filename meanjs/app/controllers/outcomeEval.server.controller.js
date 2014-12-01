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

exports.read = function(req, res) {
	res.jsonp(req.outcomeEval);
};

exports.update = function(req, res, next) {
	var outcomeEval = req.outcomeEval;
	outcomeEval = _.extend(outcomeEval, req.body);
	outcomeEval.save(function(err) {
		if (err) {
			console.log(errorHandler.getErrorMessage(err));
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(outcomeEval);
		}
	});
};

exports.outcomeEvalByID = function(req, res, next, id) {
	OutcomeEvaluation.findById(id).exec(function(err, outcomeEval) {
		if (err) return next(err);
		if (!outcomeEval) return next(new Error('Failed to load outcomeEval ' + id));
		req.outcomeEval = outcomeEval;
		next();
	});
};
