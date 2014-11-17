'use strict';

/**
 * Module dependencies.
 */
var parse = require('csv-parse'),
	mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	fs = require('fs'),
	_ = require('lodash');
	require('should');

/**
 * Store the CSV file in a variable and proceed to parse it
 */
exports.create = function(req, res) {
	var csv_file = req.body.data;
	
	var csv_file_str = csv_file.toString();
	
	parse(csv_file_str, {delimiter: ','}, function(err, output){
  		output.should.eql([ ['One','Two','Three'],['Four','Five','Six'],
			['Seven','Eight','Nine']]);
 		console.log(output);
 		
 		// send back parsed data in the response
 		res.status(200).json(csv_file_str);

	});	
	

};

