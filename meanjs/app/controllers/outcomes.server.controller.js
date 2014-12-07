/* Authors: Angel Lee, Raymond Clark */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Outcome = mongoose.model('Outcome'),
	OutcomeEvaluation = mongoose.model('OutcomeEvaluation'),
	OutcomePrototypes = mongoose.model('OutcomePrototypes'),
	_ = require('lodash');

var outcomePrototypes;
OutcomePrototypes.find().exec(function(err, oP) {
	if(oP.length == 0) {
		outcomePrototypes = new OutcomePrototypes();
		outcomePrototypes.save();
	} else {
		outcomePrototypes = oP[0];
	}
});


exports.create = function(req, res) {
	var outcome = new Outcome(req.body);
	outcome.user = req.user;

	outcome.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(outcome);
		}
	});
};

exports.createPrototype = function(req, res) {
	var outcome = new Outcome(req.body);
	outcome.user = req.user;

	outcome.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			outcomePrototypes.elements.push(outcome._id);
			outcomePrototypes.save(function(err) {
				if(err) {
					console.log(err);
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					console.log("success");
					console.log(outcomePrototypes);
					res.jsonp(outcome);
				}
			});
			
		}
	});
};

exports.read = function(req, res) {
	res.jsonp(req.outcome);
};

exports.update = function(req, res) {
	var outcome = req.outcome;
	
	if(req.body.outcomeEvaluation)
		req.body.outcomeEvaluation= req.body.outcomeEvaluation._id;
	if(req.body.outcomeAssessmentForm){
		req.body.outcomeAssessmentForm= req.body.outcomeAssessmentForm._id;
	}
	outcome = _.extend(outcome, req.body);
	outcome.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(outcome);
		}
	});
};

exports.remove = function(req, res) {

	var outcome = req.outcome;
	outcome.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			outcomePrototypes.elements.push(outcome._id);
			outcomePrototypes.save();
			res.jsonp(outcome);
		}
	});
};


exports.list = function(req, res) {
	Outcome.find().populate('outcomeEvaluation').populate('outcomeAssessmentForm').exec(function(err, outcomes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(outcomes);
		}
	});
};

exports.listPrototypes = function(req, res) {
	OutcomePrototypes.find().populate('elements').exec(function(err, oP) {
		var outcomes = oP[0].elements;
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(oP);
			res.jsonp(outcomes);
		}
	});
};

exports.outcomeByID = function(req, res, next, id) {
	Outcome.findById(id).populate('user', 'displayName').exec(function(err, outcome) {
		if (err) return next(err);
		if (!outcome) return next(new Error('Failed to load outcome ' + id));
		req.outcome = outcome;
		next();
	});
};

/**
 * Outcome authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.outcome.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};