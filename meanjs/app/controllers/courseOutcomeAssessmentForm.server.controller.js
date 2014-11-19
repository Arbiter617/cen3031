'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Course = mongoose.model('CourseOutcomeAssessmentForm'),
	Handlebars = require('handlebars'),
	phantom = require('phantom'),
	wkhtmltopdf = require('wkhtmltopdf'),
	fs = require('fs'),
	_ = require('lodash');

/**
 * Store the JSON objects for the CourseOutcomeAssessmentForm
 */
exports.create = function(req, res, next) {
	// WILL ULTIMATELY HAVE THE PARSING GET WHAT WE NEED AND SAVE IT INTO THE COURSE MODEL...

	// var csv_file = req.body.data;
	// var csv_file_str = csv_file.toString();
	
	// parse(csv_file_str, {delimiter: ','}, function(err, output){
 // 		var outStr = '';
 // 		var avgScore = 0;
 // 		for (var  i =0; i < output.length; i++) {
 // 			for (var j = 0; j < output[i].length; j++) {
 // 				if (i == 0 ) {
 // 					if (output[i][j] == 'Exam') {
 						
 // 						i++;
 // 						while (i < output.length) {
 // 							avgScore+=parseInt(output[i][j]);
 // 							i++;
 // 						}
 // 						break;
 // 					}
 // 				} 			
 // 			}
 // 		}
 // 		avgScore /= (parseInt(output.length-1));

 // 		// send back parsed data in the response
 // 		res.status(200).json(avgScore);

	var course = new Course(req.body);
	// WILL EVENUTALLY LOOK LIKE: 
	// 	var course = new Course();
	//	course.averageScore = avgScore...
	
	course.save(function(err) {
		if (err) {
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.status(200).json(course);
		}
		next();
	});
	
};


/**
 * Creates a pdf form based of the specified courseOutcomeEvaluationForm
 */
exports.read = function(req, res) {
	res.json(req.course);
};



/**
 * Update a courseOutcomeAssessmentForm
 */
exports.update = function(req, res, next) {
	var course = req.course;
	course = _.extend(course, req.body);
	course.save(function(err) {
		if (err) {
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(course);
		}
		next();
	});
};

/**
 * Delete a courseOutcomeAssessmentForm
 */
exports.delete = function(req, res, next) {
	var course = req.course;
	course.remove(function(err) {
		if (err) {
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(course);
		}
		next();
	});
};

/**
 * List of courseOutcomeAssessmentForms
 */
exports.list = function(req, res, next) {
	Course.find().sort({date: -1, courseNumber: -1}).exec(function(err, courses) {
		if (err) {
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(courses);
		}
		next();
	});

};

/**
 * CourseOutcomeAssessmentForm middleware 
 */
exports.courseOutcomeAssessmentByID = function(req, res, next, id) {
	Course.findById(id).exec(function(err, course) {
		if (err) return next(err);
		if (!course) return next(new Error('Failed to load course ' + id));
		req.course = course;
		next();
	});
};

/**
 * Not currently used, but will most likely need later.
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.course.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
