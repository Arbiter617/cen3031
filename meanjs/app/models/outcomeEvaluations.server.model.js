'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Outcome Schema
 */
var OutcomeEvaluationSchema = new Schema({
	instrumentsChosen: {
		type: String,
		default: '',
		trim: true,
		required: 'Must evaluate the instruments chosen'
	},
	likertScaleThresholds: {
		type: String,
		default: '',
		trim: true,
		required: 'Must evaluate the likert scale thresholds'
	},
	sampleGradedStudentWork: {
		type: String,
		default: '',
		trim: true,
		required: 'Must evaluate graded studnet work'
	},
	percentageOfStudentsAchievingOutcome: {
		type: String,
		default: '',
		trim: true,
		required: 'Must evaluate the percentage of students achieving outcome'
	},
	averageLikertValue: {
		type: String,
		default: '',
		trim: true,
		required: 'Must evaluate the average likert value'
	},
	achievementOfOutcome: {
		type: String,
		default: '',
		trim: true,
		required: 'Must evaluate  the achievement of outcome'
	},
	suggestedImprovements: {
		type: String,
		default: '',
		trim: true,
		required: 'Must suggest improvements'
	}
});

mongoose.model('OutcomeEvaluation', OutcomeEvaluationSchema);