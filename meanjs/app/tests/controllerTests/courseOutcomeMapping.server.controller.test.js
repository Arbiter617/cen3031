'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	//users = require('../../app/controllers/users'),
	Outcome = mongoose.model('Outcome'),
	fs = require('fs'),
	/* require XLSX */
    XLSX = require('xlsx'),
	Course = mongoose.model('Course');

function clone(obj) {
  	var copy = {};
    for (var attr in obj) {
      	copy[attr.toString()] = ''
    }
    return copy;
}

function contains(array, item) {
	for(var i = 0; i < array.length; i++) {
		if(array[i].outcomeID.toLowerCase() === item.toLowerCase()) {
			return true;
		}
	}
	return false;
}


 
 
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
 
var ws_name = "SheetJS";
 
function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

var user, user2, course2, course3, course4, course5, course6, outcome, outcome2, outcome3, outcome4, outcome5, outcome6, outcomeArray = [];

describe('Course Outcome Mapping Controller Unit Tests', function(){
	beforeEach(function(done){
		user2 = new User({
			firstName: 'Brian',
			lastName: 'Roytman',
			displayName: 'Brian Roytman',
			email: 'brian.roytman@ufl.edu',
			username: 'broyt',
			password: 'goodluck'
		});

		user2.save(function() {
			outcome2 = new Outcome({
				outcomeID: 'A',
				outcomeName: 'a. an ability to apply knowledge of mathematics, science, and engineering',
				user: user2
			});
			outcome2.save(function() {
				outcomeArray.push(outcome2);
				outcome3 = new Outcome({
					outcomeID: 'B',
					outcomeName: 'b. an ability to design and conduct experiments, as well as to analyze and interpret data',
					user: user2
				});
				outcome3.save(function(){
					outcomeArray.push(outcome3);
					outcome4 = new Outcome({
						outcomeID: 'C',
						outcomeName: 'c. an ability to design a system, component, or process to meet desired needs within realistic constraints such as economic, environmental, social, political, ethical, health and safety, ',
						user: user2
					});
					outcome4.save(function(){
						outcomeArray.push(outcome4);
						outcome5 = new Outcome({
							outcomeID: 'D',
							outcomeName: 'd. an ability to function on multidisciplinary teams',
							user: user2
						});
						outcome5.save(function(){
							outcomeArray.push(outcome5);
							outcome6 = new Outcome({
								outcomeID: 'E',
								outcomeName: 'e. an ability to identify, formulate, and solve engineering problems',
								user: user2
							});
							outcome6.save(function(){
								course2 = new Course({
									courseID: 'COP3530',
									courseName: 'Data Structures and Algorithms',
									outcomes: outcomeArray
								});
								course2.save(function(){
									outcomeArray.pop();
									course3 = new Course({
										courseID: 'CIS4204',
										courseName: 'Ethical Hacking and Penetration Testing',
										outcomes: outcomeArray
									});
									course3.save(function(){
										outcomeArray.pop();
										course4 = new Course({
											courseID: 'COP3502',
											courseName: 'Java Programming Fundamentals I',
											outcomes: outcomeArray
										});
										course4.save(function(){
											outcomeArray.push(outcome5);
											outcomeArray.push(outcome6);
											course5 = new Course({
												courseID: 'COP3503',
												courseName: 'Java Programming Fundamentals II',
												outcomes: outcomeArray
											});
											course5.save(function(){
												outcomeArray.pop();
												course6 = new Course({
													courseID: 'CEN3031',
													courseName: 'Intro to Software Engineering',
													outcomes: outcomeArray
												});
												course6.save(function(){
													done();
												});
											});
											
										});
									});
								});
							});			
						});
					});
				});
			});
		});	
	});

	describe('JSON 2 XLS', function() {
		it('Should generate XLS from Course and Outcome JSON', function(done) {
			function XMappingPrototype() {
				this.courseID = '';
				this.courseName = '';
				this.a = '';
				this.b = '';
				this.c = '';
				this.d = '';
				this.e = ''; 
				this.f = '';
				this.g = '';
				this.h = '';
				this.i = '';
				this.j = '';
				this.k = '';
				this.l = '';
			}
			var potentialOutcomes = ['a','b','c','d','e','f','g','h','i','j','k','l'];
			var potentialNames = ['aa', 'bb', 'cc', 'dd', 'ee','ff', 'gg', 'hh', 'ii', 'jj', 'kk', 'll'];

			function NumMappingPrototype() {
				this.outcomeID = '';
				this.outcomeName = '';
			}

			Course.find({}, {_id: 0}).populate('outcomes').exec(function(err, courses) {
				if (err) { 
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					var prototypeArray = [];
					var totalArray = [];
					
					var numberPrototype = new NumMappingPrototype();
					//Set up the numberPrototype and don't change this. Used to create new objects.
					var nameArray = [];
					nameArray.push('Outcome');
					nameArray.push('Description');
					for(var i = 0; i < courses.length; i++) {
						nameArray.push(courses[i].courseID.toString());
						numberPrototype[courses[i].courseID.toString()] = '';
						
					}
					totalArray.push(nameArray);
					for(var i = 0; i < potentialOutcomes.length; i++) {
						var prototype = clone(numberPrototype);
						var semiArray = [];
						prototype.outcomeID = potentialOutcomes[i];
						semiArray.push(potentialOutcomes[i])
						prototype.outcomeName = potentialNames[i];
						semiArray.push(potentialNames[i]);
						for(var j = 0; j < courses.length; j++){
							if(contains(courses[j].outcomes,potentialOutcomes[i])) {
								prototype[courses[j].courseID.toString()] = '1';
								semiArray.push('1');
							} else {
								semiArray.push('');
							}
						}
						prototypeArray.push(prototype);
						totalArray.push(semiArray);
					}

					var count = clone(numberPrototype);
					var countArray = [];
					countArray.push('');
					countArray.push('');
					for(var j = 0; j < courses.length; j++){
						count[courses[j].courseID.toString()] = courses[j].outcomes.length;
						countArray.push(courses[j].outcomes.length);
					}
					totalArray.push(countArray);
					prototypeArray.push(count);
					prototypeArray.push([]);
					prototypeArray.push([]);
					totalArray.push([]);
					totalArray.push([]);

					for(var i = 0; i < courses.length; i++)
					{	
						var prototype = new XMappingPrototype();
						
						prototype.courseID = courses[i].courseID;
						prototype.courseName = courses[i].courseName;
						
						for(var j = 0; j < courses[i].outcomes.length; j++) {
							prototype[courses[i].outcomes[j].outcomeID.toLowerCase()] = 'X';
						}
						prototypeArray.push(prototype);

					}
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

					//console.log(require('util').inspect(totalArray));
		

					var json2xls = require('json2xls');
					var stringifyOutcome = JSON.stringify(prototypeArray, null, '\t');
					var parseFinalOutcome = JSON.parse(stringifyOutcome);

					fs.writeFileSync('./courseMappingControllerTestData.xls', json2xls(parseFinalOutcome), 'binary');
					

					var wb = new Workbook(), ws = sheet_from_array_of_arrays(totalArray);
 
					/* add worksheet to workbook */
					wb.SheetNames.push(ws_name);
					wb.Sheets[ws_name] = ws;
 
					/* write file */
					XLSX.writeFile(wb, 'test.xlsx'); 

					done();
				}
			});
		});

	});


	afterEach(function(done) {
		User.remove().exec();
		Course.remove().exec();
		Outcome.remove().exec();
		done();
	});		
});	