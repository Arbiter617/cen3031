'use strict';

/**
 * Module dependencies.
 */
var parse = require('csv-parse'),
	mongoose = require('mongoose'),
	Course = mongoose.model('CourseOutcomeAssessmentForm'),
	errorHandler = require('./errors'),
	_ = require('lodash');

/**
 * Store the CSV file in a variable and proceed to parse it
 */
 /** need number of students
 		 * grading scale (will be provided)
 		 * avg score
 		 * % students achieving adequate score
 		 */
exports.create = function(req, res, next) {
	var csv_file = req.body.data;
	var csv_file_str = csv_file.toString();
	var likert = req.body.likert;
	var cols = likert.columns.split(',');
	cols.forEach(function(element, index, array) {
		array[index] = parseInt(element);
	});

	parse(csv_file_str, {delimiter: ','}, function(err, output){
 		var averageScore, totalGradeCount, avgScore;
 		averageScore = totalGradeCount = avgScore = 0;
 		var likertScores = [0,0,0,0,0]; 
 		//For each column in the specified parsed columns
 		for (var  i =0; i < cols.length; i++) {
 			for (var j = 1; j < output.length; j++) {
 				var value = parseInt(output[j][cols[i]-1]);
 				averageScore += value;
 				totalGradeCount++;
 				if(value < likert.score1) {
 					likertScores[0]++;
 				} else if(value < likert.score2) {
 					likertScores[1]++;
 				} else if(value < likert.score3) {
 					likertScores[2]++;
 				} else if(value < likert.score4) {
 					likertScores[3]++;
 				} else {
 					likertScores[4]++;
 				}
 			}
 		}
 		var numberOfStudents = output.length - 1;
 		averageScore /= totalGradeCount;
 		var tempSum = 0;
 		for(var i = 1; i <= likertScores.length; i++) {
 			tempSum += likertScores[i-1]*i;
 		}
 		var averageLikertScore = Math.round(tempSum / totalGradeCount);
 		tempSum = 0;
 		for(var i = likert.minValue - 1; i < likertScores.length; i++) {
 			tempSum += likertScores[i]/cols.length;
 		}
 		var percentageAchievingOutcome = (tempSum/ numberOfStudents) * 100;
 		var gradingScale = '0-' + likert.maximum;

 		var courseOutcome = {
 			numberOfStudents: numberOfStudents,
 			averageScore: averageScore.toFixed(2),
 			averageLikertScore: averageLikertScore,
 			percentageAchievingOutcome: percentageAchievingOutcome.toFixed(2),
 			gradingScale: gradingScale,
 			minimumAcceptableLikertValue: likert.minValue
 		};
 		res.jsonp(courseOutcome);

	});	
	

};

