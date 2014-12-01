'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Course = mongoose.model('Course'),
	OutcomeAssessmentForm = mongoose.model('CourseOutcomeAssessmentForm'),
	Handlebars = require('handlebars'),
	wkhtmltopdf = require('wkhtmltopdf'),
	controller = require('./pdfGenerator'),
	fs = require('fs'),
	_ = require('lodash');

exports.generatePDF = function (req, res) {
  	var path = __dirname + '/pdfs/' + req.courseCommittee._id + '.pdf';
  	wkhtmltopdf(req.body.data, { pageSize: req.pageSize, output: path },  function() {
  		res.jsonp(req.courseCommittee._id);
  	});
};

exports.returnPDF = function(req,res) {
	var path = __dirname + '/pdfs/' + req.courseCommittee._id + '.pdf';
	res.download(path, req.courseCommittee._id + '.pdf', function(err) {
		if(err) {
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});
};

exports.generateHTML = function(req,res) {
	fs.readFile(req.fileName, function(err,data) {
		if(err) {
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}

		var template = Handlebars.compile(data.toString());
		var result = template(req.courseCommittee);

		req.body.data = result;
		req.body._id = req.courseCommittee._id;
		controller.generatePDF(req,res);
	});
	
};

exports.getCommitteeFile = function(req,res) {
	var fileName = __dirname + '/pdfModels/CourseCommitteeEvaluationForm.html';
	req.fileName = fileName;
	controller.generateHTML(req,res);
};

exports.getOutcomeFile = function(req, res) {
	var fileName = __dirname +'/pdfModels/CourseOutcomeAssessmentForm.html';
	req.fileName = fileName;
	controller.generateHTML(req,res);
}

exports.courseByID = function(req, res, next, id) { 
	console.log('Im here');
	Course.findById(id)
		.populate('courseCommitteeEvaluationForm')
		.populate('outcomes')
		.exec(function(err, values) {
			var options = {
				path: 'outcomes.outcomeEvaluation',
				model: 'OutcomeEvaluation'
			};
			if (err) return next(err);
			Course.populate(values, options,function(err, values2) {
				if (err) return next(err);
				options = { 
					path: 'outcomes.outcomeAssessmentForm',
					model: 'CourseOutcomeAssessmentForm'
				};
				Course.populate(values, options,function(err, courseCommittee) {
					if (err) return next(err);
					if (!courseCommittee) return next(new Error('Failed to load course committee ' + id));
					req.courseCommittee = courseCommittee;
					req.pageSize = 'A3';
					next();
				});
			});
		});
};

exports.outcomeAssessmentByID = function(req, res, next, id) {
	OutcomeAssessmentForm.findById(id).exec(function(err, course) {
		if (err) return next(err);
		if (!course) return next(new Error('Failed to load course ' + id));
		req.courseCommittee = course;
		req.pageSize = 'A4';
		next();
	});
};