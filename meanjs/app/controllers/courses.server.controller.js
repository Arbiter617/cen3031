'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Course = mongoose.model('Course'),
	Outcome = mongoose.model('Outcome'),
	CourseCommitteeEvaluationForm = mongoose.model('CourseCommitteeEvaluationForm'),
	OutcomeEvaluation = mongoose.model('OutcomeEvaluation'),
	_ = require('lodash'),
	q = require('q');

exports.create = function(req, res) {
	var course = new Course(req.body);
	course.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
};

exports.update = function(req, res) {
	var course = req.course;
	course = _.extend(course, req.body);

	course.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
};

function saveToDB(item, res) {
	var d = q.defer();
	item.save(function(err) {
		if(err) {
			d.reject();
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log("resolved");
			d.resolve();
		}
	});
	console.log(d.promise);
	return d.promise;
}

exports.remove = function(req, res) {

	var course = req.course;

	course.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
};

exports.read = function(req, res) {
	res.jsonp(req.course);
};

exports.list = function(req, res) {
	Course.find().exec(function(err, courses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(courses);
		}
	});
};

exports.courseByID = function(req, res, next, id) {
	Course.findById(id).exec(function(err, course) {
		if (err) return next(err);
		if (!course) return next(new Error('Failed to load course ' + id));
		req.course = course;
		next();
	});
};
