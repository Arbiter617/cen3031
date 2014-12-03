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
	courseNumber: {
		type: String,
		required: false
	},
	term: {
		type: String,
		trim: true,
		default: '',
		required: false
	},
	courseTitle: {
		type: String,
		trim: true,
		default: '',
		required: false
	},
	/*
		This might need to be its own small schema and then we would nest it.
	*/
	instructor: {
		type: String,
		trim: true,
		default: '',
		required: false
	},
	date: {
		type: Date,
		trim: true,
		default: Date.now,
		required: false
	},
	descriptionOfInstrument: {
		type: String,
		trim: true,
		default: '',
		required: false
	},
	numberOfStudents: {
		type: Number,
		required: false
	},
	/* I think this needs to be a string. e.g. 0-10 or 0-100 */
	gradingScale: {
		type: String,
		trim: true,
		default: '0-10',
		required: false
	},
	averageScore: {
		type: Number,
		required: false
	},
	scoreForAdequateOutcomeAchievement: {
		type: Number,
		required: false
	},
	percentOfStudentsAchievingOutcomeAdequately: {
		type: Number,
		required: false
	},
	averageLikertScaleValue: {
		type: Number,
		required: false
	},
	instructorComments: {
		type: String,
		trim: true,
		default: '',
		required: false
	}
});

mongoose.model('CourseOutcomeAssessmentForm', CourseOutcomeAssessmentFormSchema);