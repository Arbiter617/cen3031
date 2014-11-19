'use strict';

/**
*Module Dependencies
*/
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
* CourseOutcomeAssessmentForm Schema
*/
var CourseOutcomeAssessmentFormSchema = new Schema({
	description: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	courseNumber: {
		type: Number,
		required: true
	},
	term: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	courseTitle: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	/*
		This might need to be its own small schema and then we would nest it.
	*/
	instructor: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	date: {
		type: Date,
		trim: true,
		default: Date.now,
		required: true
	},
	descriptionOfInstrument: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	numberOfStudents: {
		type: Number,
		required: true
	},
	/* I think this needs to be a string. e.g. 0-10 or 0-100 */
	gradingScale: {
		type: String,
		trim: true,
		default: '0-10',
		required: true
	},
	averageScore: {
		type: Number,
		required: true
	},
	scoreForAdequateOutcomeAchievement: {
		type: Number,
		required: true
	},
	percentOfStudentsAchievingOutcomeAdequately: {
		type: Number,
		required: true
	},
	averageLikertScaleValue: {
		type: Number,
		required: true
	},
	instructorComments: {
		type: String,
		trim: true,
		default: '',
		required: true
	}
});

mongoose.model('CourseOutcomeAssessmentForm', CourseOutcomeAssessmentFormSchema);