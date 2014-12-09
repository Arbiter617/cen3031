'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Course = mongoose.model('Course'),
	Outcome = mongoose.model('Outcome'),
	OutcomePrototype = mongoose.model('OutcomePrototypes'),
	controller = require('./outcomes'),
	XLSX = require('xlsx'),
	fs = require('fs');

//Functions sheet_from_array_of_arrays and Workbook are courtesy of
//https://gist.github.com/SheetJSDev/88a3ca3533adf389d13c

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';
			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}
 
var ws_name = "CourseOutcomeMappings";
 
function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}
function contains(array, item) {
	for(var i = 0; i < array.length; i++) {
		if(array[i].outcomeID.toLowerCase() === item.toLowerCase()) {
			return true;
		}
	}
	return false;
}


exports.generate = function(req, res) {
	
	var potentialOutcomes = [];
	var potentialNames = [];
	OutcomePrototype.find().populate('elements').exec(function(err, outcomes) {
		outcomes= outcomes[0].elements;
		outcomes.sort(function (a, b) {
 			if (a.outcomeID.toLowerCase() > b.outcomeID.toLowerCase()) {
    			return 1;
  			}
  			if (a < b) {
    			return -1;
  			}
  			return 0;
  		});
		for(var i = 0; i < outcomes.length; i++) {
			potentialOutcomes.push(outcomes[i].outcomeID);
			potentialNames.push(outcomes[i].outcomeName);
		}
		Course.find({}, {_id: 0}).populate('outcomes').exec(function(err, courses) {
			if (err) { 
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				var totalArray = [];
						
				var nameArray = [];
				nameArray.push('Outcome');
				nameArray.push('Description');

				for(var i = 0; i < courses.length; i++) {
					nameArray.push(courses[i].courseID.toString());
				}
				totalArray.push(nameArray);

				for(var i = 0; i < potentialOutcomes.length; i++) {
					var semiArray = [];

					semiArray.push(potentialOutcomes[i])
					semiArray.push(potentialNames[i]);
					for(var j = 0; j < courses.length; j++){
						if(contains(courses[j].outcomes,potentialOutcomes[i])) {
							semiArray.push('1');
						} else {
							semiArray.push('');
						}
					}
					totalArray.push(semiArray);
				}

				var countArray = [];
				countArray.push('');
				countArray.push('');
				for(var j = 0; j < courses.length; j++) {
					countArray.push(courses[j].outcomes.length);
				}
				totalArray.push(countArray);
				totalArray.push([]);
				totalArray.push([]);

				nameArray = [];
				nameArray.push('');
				nameArray.push('');
				nameArray.push('Outcomes');
				totalArray.push(nameArray);

				nameArray = [];
				nameArray.push('Course ID');
				nameArray.push('Course Name');

				for(var i = 0; i < potentialOutcomes.length; i++) {
					nameArray.push(potentialOutcomes[i].toString().toLowerCase());
				}
				totalArray.push(nameArray);

				for(var i = 0; i < courses.length; i++) {
					var semiArray = [];
					semiArray.push(courses[i].courseID);
					semiArray.push(courses[i].courseName);
					var tempArray = [];
					for(var j = 0; j < courses[i].outcomes.length; j++) {
						tempArray.push(courses[i].outcomes[j].outcomeID.toLowerCase());
					}
					tempArray.sort(function (a, b) {
 						 if (a > b) {
    						return 1;
  						}
  						if (a < b) {
    						return -1;
  						}
  						return 0;
					});
					var tempCount = 0;
					for(var j = 0; j < potentialOutcomes.length; j++) {
						if(tempArray[tempCount] === potentialOutcomes[j].toLowerCase()) {
							tempCount++;
							semiArray.push('X');
						} else {
							semiArray.push('');
						}
					}
					totalArray.push(semiArray);
				}

				var wb = new Workbook(), ws = sheet_from_array_of_arrays(totalArray);
				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;

 				var path = __dirname + '/xlsxs/courseMapping.xlsx';
				XLSX.writeFile(wb, path); 


				res.download(path, 'courseMapping.xlsx', function(err) {
					if(err) {
						throw err;
					}
				});
			}
		});	
	});	
};