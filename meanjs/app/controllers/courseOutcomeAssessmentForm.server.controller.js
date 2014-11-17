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
	var course = new Course(req.body);
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
 * Uses phantomjs to render the provided html into a pdf.
 * 'paperSize' sets the size of the pdf generated to be what is normal looking
 * res.download(..) returns the specified file to the front end for downloading
 * Might have to change it so that is returns the url instead of the actual file.
 */
var generatePDF = function (html,id,req,res) {
	/*
	phantom.create(function (ph) {
  		ph.createPage(function (page) {
     		page.setContent(html);
     		page.set('paperSize', { format: 'A4'});
     		var path = __dirname + '/pdfs/' + id + '.pdf';
      		page.render(path, function() {
      			ph.exit();
				res.download(path, 'report.pdf', function(err) {
					if(err) {
						res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					}
				});
      		});  	
    	});
  	});
*/

  	var path = __dirname + '/pdfs/' + id + '.pdf';
  	wkhtmltopdf(html, { pageSize: 'A4', output: path },  function() {
  		res.download(path, 'report.pdf', function(err) {
					if(err) {
						throw err;
					}
		});
  	});

};

/**
 * Uses Handlebarsjs to dynamically populate a html template with a json object.
 * TODO fix this so the date appears without the time in it.
 */ 
var generateHTML = function(course,filename,req,res,next) {
	fs.readFile(filename, function(err,data) {
		var template = Handlebars.compile(data.toString());
		var result = template(course);
		//generate the pdf
		if(next) {
			next();
		} else {
			generatePDF(result, course._id,req,res);
		}
	});
};

/**
 * Creates a pdf form based of the specified courseOutcomeEvaluationForm
 */
exports.read = function(req, res) {
	var filename = __dirname + '/pdfModels/CourseOutcomeAssessmentForm.html';
	generateHTML(req.course,filename,req,res);
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
