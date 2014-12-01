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


function saveToDB(item) {
	var d = q.defer();
	console.log("before save");
	console.log(item);
	item.save(function(err) {
		console.log("save callback");
		if (err) {
			console.log(err);
			console.log(errorHandler.getErrorMessage(err));
			d.reject();
		} else {
			console.log("saved\n");
			d.resolve();
		}
	});
	return d.promise;
}

exports.addOutcome = function(req, res) {
	var course = req.course;
	var outcomes = req.body;

	//save outcome clones to db
	var promises = [];
	for(var i = 0; i < outcomes.length; i++) {
		var o = outcomes[i];
		var outcome = new Outcome({ outcomeName: o.outcomeName,
									outcomeID: o.outcomeID });
		//outcome.OutcomeEvaluation = outcome.OutcomeEvaluation._id;
		console.log(outcome);
		promises.push(saveToDB(outcome));
	}
	//console.log(outcomes);
	//console.log(course);
	q.all(promises).then(function() {
		console.log("q all");
		for(var i = 0; i < outcomes.length; i++) {
			course.outcomes.push(outcomes[i]._id);
		}
		//save new course to db
		saveToDB(course).then(function() {
			console.log("responding");
			res.jsonp(course);
		});
	});
};

exports.update = function(req, res) {
	var course = req.course;
	course = _.extend(course, req.body);

	course.save(function(err) {
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
};

exports.submitForm = function(req, res, next) {
	var course = req.body;
	console.log('\n\nIn submitForm\n\n');

	//... create and update course object

	course.save(function(err) {
		if(err) {
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
		next();
	})
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
