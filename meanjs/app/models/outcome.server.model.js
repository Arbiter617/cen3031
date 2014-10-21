'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var OutcomeSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Must outcome name'
	}
});

mongoose.model('Outcome', OutcomeSchema);