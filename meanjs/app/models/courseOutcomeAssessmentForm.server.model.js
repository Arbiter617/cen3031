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
		required: true
	},
	courseTitle: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
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
		default: ''
	},
	numberOfStudents: {
		type: Number,
		required: true
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
		default: ''
	},
	score1: {
		type: Number,
		required:true
	},
	score2: {
		type: Number,
		required: true
	},
	score3: {
		type: Number,
		required: true
	},
	score4: {
		type: Number,
		required: true
	},
	score5: {
		type: Number,
		required: true
	}
});

mongoose.model('CourseOutcomeAssessmentForm', CourseOutcomeAssessmentFormSchema);