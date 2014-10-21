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
	outcomes: [{
		type: Schema.ObjectId,
		ref: 'Outcome'
	}]
});

mongoose.model('Course', CourseSchema);