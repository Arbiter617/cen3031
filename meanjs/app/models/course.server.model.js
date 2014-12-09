'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Course Schema
 */
var CourseSchema = new Schema({
	courseID: {
		type: String,
		default: '',
		trim: true,
		required: 'Must have course ID'
	},
	courseName: {
		type: String,
		default: '',
		trim: true,
		required: 'Must have course Name'
	},
	courseTerm: {
		type: String,
		default: '',
		trim: true
	},
	courseYear: {
		type: String,
		default: '',
		trim: true
	},
	outcomes: [{
		type: Schema.ObjectId,
		ref: 'Outcome'
	}],
	courseCommitteeEvaluationForm: {
		type: Schema.ObjectId,
		ref: 'CourseCommitteeEvaluationForm'
	}
}, {versionKey: false});

mongoose.model('Course', CourseSchema);