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
 /** need number of students
 		 * grading scale (will be provided)
 		 * avg score
 		 * % students achieving adequate score
 		 */
exports.create = function(req, res) {
	var csv_file = req.body.data;
	var csv_file_str = csv_file.toString();
	
	parse(csv_file_str, {delimiter: ','}, function(err, output){

 		var outStr = '';
 		var avgScore = 0;

 		for (var  i =0; i < output.length; i++) {
 			
 			// if (i == 0) {
 			// 		outStr += output[i][3]+' ';
 			// 	}
 			// 	else {
 			// 	outStr += output[i][3]+'\t';
 			// 	avgScore += parseInt(output[i][3]);
 			// }
 			for (var j = 0; j < output[i].length; j++) {
 				if (i == 0 ) {
 					if (output[i][j] == 'Exam') {
 						// console.log('Exam data is in column '+j+'!');
 						i++;
 						while (i < output.length) {
 							// console.log('adding ' +output[i][j]+' to average score ');
 							avgScore+=parseInt(output[i][j]);
 							i++;
 						}
 						break;
 					}
 				}
 				// if (i == 0) {
 				// 	outStr += output[i][j]+' ';
 				// }
 				// else {
 				// outStr += output[i][j]+'\t';
 			
 			}
 			// outStr+='\n';

 		}

 		avgScore /= (parseInt(output.length-1));
 		// console.log(outStr);
 		// console.log('average score is' +avgScore);

 		// send back parsed data in the response
 		res.status(200).json(avgScore);

	});	
	

};

