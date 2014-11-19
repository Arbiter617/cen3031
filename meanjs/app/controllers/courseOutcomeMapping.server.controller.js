'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Course = mongoose.model('Course'),
	Outcome = mongoose.model('Outcome'),
	fs = require('fs'),
	util = require('util');
	//_ = require('lodash');




function xlsconvert(courses){
		var json2xls = require('json2xls');
		var stringifyOutcome = JSON.stringify(courses, null, '\t');
		//console.log(stringifyOutcome);
		var parseFinalOutcome = JSON.parse(stringifyOutcome);
		//console.log(util.inspect(parseFinalOutcome, {depth:null}));

		fs.writeFileSync('./courseArrayData.xls', json2xls(parseFinalOutcome), 'binary');
	}

exports.generate = function(req, res) {
	console.log('hi');
	Course.find().populate('outcomes').exec(function(err, courses) {
		if (err) { 
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			//courses = courses.toObject();
			//delete outcomes["_id"];
			//delete outcomes["__v"];
			for(var i = 0; i < courses.length; i++)
			{	
				for(var j = 0; j < courses[i].outcomes.length; j++) {
					courses[i].outcomes[j] = courses[i].outcomes[j].outcomeID;
				}

			}
			console.log(courses);
			xlsconvert(courses);
			
		}


	});	
};