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

exports.submitForm = function(req, res) {
	var course = req.body;
	var evalForm = new CourseCommitteeEvaluationForm(course.courseCommitteeEvaluationForm);

	var deffereds = [];
	deffereds.push(saveToDB(evalForm, res));

	for(var i = 0; i < course.outcomes.length; i++) {
		var outcomeEval = new OutcomeEvaluation(course.outcomes[i].outcomeEvaluation);
		deffereds.push(saveToDB(outcomeEval, res));

		course.outcomes[i].outcomeEvaluation = outcomeEval;
	}

	console.log(course);
	console.log(deffereds);

	q.all(deffereds).then(function(data) {
		console.log("in q");
		console.log(req.course);
		
		course.courseCommitteeEvaluationForm = evalForm._id;
		for(var i = 0; i < course.outcomes.length; i++) {
			console.log("loop)");
			course.outcomes[i].outcomeEvaluation = course.outcomes[i].outcomeEvaluation._id;
			console.log(course.outcomes[i]);
			course.outcomes[i].save(function(err) {
				if(err) {

					console.log(errorHandler.getErrorMessage(err));
					return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});	
				} else {
					console.log("saved outcome");

//Hi beauty babe, I love u so so so 
					course.outcomes[i] = course.outcomes[i]._id;
					console.log("aftersave");
					console.log(req.course);
					console.log(course);
					course = _.extend(req.course, course);
					console.log("extended course");

					course.save(function(err) {
						if(err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});		
						} else {
							res.jsonp(course);
						}
					});
				}
			});
			
		}
		
	});
}

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
