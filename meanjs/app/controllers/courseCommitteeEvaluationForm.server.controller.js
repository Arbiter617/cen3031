'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	CourseCommittee = mongoose.model('CourseCommitteeEvaluationForm'),
	Handlebars = require('handlebars'),
	wkhtmltopdf = require('wkhtmltopdf'),

	fs = require('fs'),
	_ = require('lodash');

/**
 * Store the JSON objects for the CourseCommitteeEvaluationForm
 */
exports.create = function(req, res,next) {
	var courseCommittee = new CourseCommittee(req.body);
	courseCommittee.save(function(err) {
		if (err) {
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.status(200).json(courseCommittee);
		}
		next();
	});
	
};


/**
 * Creates a pdf form based of the specified courseCommitteeEvaluationForm
 */
exports.read = function(req, res) {
	res.json(req.courseCommittee);
};



/**
 * Update a courseCommitteeEvaluationForm
 */
exports.update = function(req, res, next) {
	var courseCommittee = req.courseCommittee;
	courseCommittee = _.extend(courseCommittee, req.body);
	courseCommittee.save(function(err) {
		if (err) {
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(courseCommittee);
		}
	});
};

/**
 * Delete a courseCommitteeEvaluationForm
 */
exports.delete = function(req, res, next) {
	var courseCommittee = req.courseCommittee;

	courseCommittee.remove(function(err) {
		if (err) {
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(courseCommittee);
		}
		next();
	});
};

/**
 * List of courseCommitteeEvaluationForms
 */
exports.list = function(req, res) {
	//TODO fix this sort. Should sort by date not instructor. Set as instructor
	//because I was running into errors in my tests where Date would be the same
	//so I couldn't reasonably predict the behavior of the response.
	CourseCommittee.find().sort('courseCommitteeParticipants').exec(function(err, courses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(courses);
		}
	});

};

/**
 * CourseCommitteeEvaluationForm middleware used to retrieve the evaluationForm from the database 
 */
exports.courseCommitteeEvaluationByID = function(req, res, next, id) {
	CourseCommittee.findById(id).exec(function(err, courseCommittee) { 
		if (err) return next(err);
		if (!courseCommittee) return next(new Error('Failed to load course committee ' + id));
		req.courseCommittee = courseCommittee;
		next();
	});
	
};

/**
 * Not currently used, but will most likely need later.
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.courseCommittee.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
