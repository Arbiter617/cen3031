'use strict';

/**
 *Module Dependencies
 */

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
* CourseOutcomeMappingForm Schema
*/

var CourseOutcomeMappingFormSchema = new Schema({
	courseTitle: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	outcomeA: {
		type: Number,
		default: 0,
		required: true
	},
	outcomeB: {
		type: Number,
		default: 0,
		required: true
	},
	outcomeC: {
		type: Number,
		default: 0,
		required: true
	},
	outcomeD: {
		type: Number,
		default: 0,
		required: true
	},
	outcomeE: {
		type: Number,
		default: 0,
		required: true
	},
	outcomeF: {
		type: Number,
		default: 0,
		required: true
	},
	outcomeG: {
		type: Number,
		default: 0,
		required: true
	},
	outcomeH: {
		type: Number,
		default: 0,
		required: true
	},
	outcomeI: {
		type: Number,
		default: 0,
		required: true
	},
	outcomeJ: {
		type: Number,
		default: 0,
		required: true
	},
	outcomeK: {
		type: Number,
		default: 0,
		required: true
	},
	outcomeL: {
		type: Number,
		default: 0,
		required: true
	}
});

mongoose.model('CourseOutcomeMappingForm', CourseOutcomeMappingFormSchema);

