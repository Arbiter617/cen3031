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
		default: '',
		required: true
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
		default: ''
	},
	numberOfStudents: {
		type: Number,
		required: false
	},
	columns: {
		type: String,
		trim: true,
		default: ''
	},
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
		default: ''
	},
	score1: {
		type: Number,
		required:false
	},
	score2: {
		type: Number,
		required: false
	},
	score3: {
		type: Number,
		required: false
	},
	score4: {
		type: Number,
		required: false
	},
	score5: {
		type: Number,
		required: false
	}
});

mongoose.model('CourseOutcomeAssessmentForm', CourseOutcomeAssessmentFormSchema);