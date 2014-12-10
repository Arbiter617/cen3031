'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Course = mongoose.model('Course'),
	plot = require('plotter').plot,
	fs = require('fs'),
	_ = require('lodash');

var plotting = function(req,res) {
	var obj = {};
	var courses = req.courses;
	for(var i = 0; i < courses.length; i++)
	{
		for(var j = 0; j < courses[i].outcomes.length; j++)
		{
			if(!obj.hasOwnProperty(courses[i].outcomes[j].outcomeID.toLowerCase()))
			{
				obj[courses[i].outcomes[j].outcomeID.toLowerCase()] = [];
			}
			obj[courses[i].outcomes[j].outcomeID.toLowerCase()].push(courses[i].outcomes[j].outcomeAssessmentForm.averageLikertScaleValue);
		}
	}
	/*
			plot({
   					data: { "Average Score"  :  [course1.averageScore, course2.averageScore, course3.averageScore, course4.averageScore],
   							"Score For Adequate Outcome Achievement" : [course1.scoreForAdequateOutcomeAchievement, 
   																		course2.scoreForAdequateOutcomeAchievement, 
   																		course3.scoreForAdequateOutcomeAchievement, 
   																		course4.scoreForAdequateOutcomeAchievement] },
    				filename:   'AverageScoresVSAdequateOutcomeAchievement.pdf',
    				title:      'Average Score VS Score For Adequate Outcome Achievement',
    				xlabel:     'Courses',
    				ylabel:     'Score',
    				logscale:   true,
    				format:     'pdf'
			});
	*/
	for(var property in obj)
	{
			plot({
   					data:  		obj[property], 
    				filename:   'TestLikert' + property + '.pdf',
    				title:      'Percent Of Students \\n Achieving Outcome Adequately',
    				xlabel:     'Courses',
    				ylabel:     'Percentage', 
    				logscale:   true,
    				format:     'pdf'
			});
	}
	res.jsonp(obj);

};


exports.dataAnalytics = function(req, res) { 
	Course.find()
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
					req.courses = courseCommittee;
					plotting(req,res);
				});
			});
		});
};

