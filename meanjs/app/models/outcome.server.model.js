/* Authors: Angel Lee, Raymond Clark */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Outcome Schema
 */
var OutcomeSchema = new Schema({
	outcomeID: {
		type: String,
		default: '',
		trim: true,
		required: 'Must have outcome ID'
	},

	outcomeName: {
		type: String,
		default: '',
		trim: true,
		required: 'Must have outcome name (description)'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	outcomeAssessmentForm: {
		type: Schema.ObjectId,
		ref: 'CourseOutcomeAssessmentForm'
	},
	outcomeEvaluation: {
		type: Schema.ObjectId,
		ref: 'OutcomeEvaluation'
	}
});

var OutcomePrototypesSchema = new Schema({
	elements: [{
		type: Schema.ObjectId,
		ref: 'Outcome'
	}]
});

mongoose.model('Outcome', OutcomeSchema);
mongoose.model('OutcomePrototypes', OutcomePrototypesSchema);
