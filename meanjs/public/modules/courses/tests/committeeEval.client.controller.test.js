'use strict';

(function() {
	// Courses Controller Spec
	describe('committeeEvalController', function() {
		// Initialize global variables
		var CommitteeEvalController,
			Authentication,
			scope,
			$httpBackend,
			$stateParams,
			$location,
			sampleCommitteeEval,
			sampleCommitteeEvalData;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			ajasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, CommitteeEvalForm) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Courses controller.
			CommitteeEvalController = $controller('CommitteeEvalController', {
				$scope: scope
			});

			sampleCommitteeEval = new courseCommitteeEvaluationForm({
				instructor = 'John Doe',
				date = new Date(),
			    courseNumber = 'CEN 3031',
			    courseTitle = 'Software Engineering',
			    courseCommitteeParticipants = 'Bob Dylan';
			});

			sampleCommitteeEvalData = new courseCommitteeEvaluationForm({			
				instructor = 'John Doe',
				date = new Date(),
			    courseNumber = 'CEN 3031',
			    courseTitle = 'Software Engineering',
			    courseCommitteeParticipants = 'Bob Dylan';
			});
		}));
		
		it('$scope.submit(form) should submit the evaluation form', inject(function(CommitteeEvalForm){

		}));
		$scope.submit = function(form) {
			var course = $scope.course;
			course.outcomes = [];

			//promises for saving outcome evals
			var promises = [];

			//save outcome evals and populate course.outcomes with 
			//outcome _id's
			for(var i = 0; i < $scope.outcomes.length; i++) {
				var outcome = $scope.outcomes[i];
				promises.push(saveToDB('outcomeEval', outcome.outcomeEvaluation));
				course.outcomes[i] = outcome._id;
			}

			//update outcomes when outcome evals are
			//done saving
			$q.all(promises).then(function(data) {
				for(var i = 0; i < $scope.outcomes.length; i++) {
					var outcome = $scope.outcomes[i];
					outcome.outcomeEvaluation = data[i]._id;
					outcome.$update();
				}
			});

			//save courseCommitteeEval form and update course
			//when done
			saveToDB('courseCommitteeEvaluation', $scope.form).then(function(data) {
				course.courseCommitteeEvaluationForm = data._id;

				//generate pdf when course saves
				$http.put('courses/' + course._id, course).success(function(response) {
					generatePDF(course._id);
					$location.path('/list-courses');
				});
			});
		}

		it('$scope.generatePDF(course_id) should POST the pdf', inject(function(CommitteeEvalForm){
				scope.instructor = 'John Doe',
				scope.date = new Date(),
			    scope.courseNumber = 'CEN 3031',
			    scope.courseTitle = 'Software Engineering',
			    scope.courseCommitteeParticipants = 'Bob Dylan';	

				// Set POST response
				$httpBackend.expectPOST('committeePDF/', sampleCommitteeEvalData).respond(sampleCommitteeEval);
				$httpBackend.expectGET('committeePDF/').respond([sampleCommitteeEval]);	

				// Run controller functionality
				scope.create();
				$httpBackend.flush();

				// Test form inputs are reset
				expect(scope.instructor).toEqual('');
				expect(scope.date).toEqual(null);
				expect(scope.courseNumber).toEqual('');
				expect(scope.courseTitle).toEqual('');
				expect(scope.courseCommitteeParticipants).toEqual('');
		}));


		function setFormFields(course) {
			$scope.form.instructor = user.firstName + " " +user.lastName;
			$scope.form.date = new Date();
			$scope.form.courseNumber = course.courseID;
			$scope.form.courseTitle = course.courseName;
			$scope.form.courseCommitteeParticipants = $scope.form.instructor;
		}

		$scope.getUserCourses = function() {
			var d = $q.defer();
		 	$http.get('users/courses').success(function(response) {
				$scope.userCourses = response;
				d.resolve();
			}).error(function(response) {
				$scope.error = response.message;
				console.log(response.message);
			});
			return d.promise;
		};

		$scope.getOutcomes = function() {
			var d = $q.defer();
			$scope.outcomes = Outcomes.query(function() {
				d.resolve();
			});
			return d.promise;
		}

		function outcomeById(id) {
			for(var i = 0; i < $scope.outcomes.length; i++) {
				if($scope.outcomes[i]._id === id)
					return $scope.outcomes[i];
			}
		}

		function resolveOutcomes(courses) {
			for(var i = 0; i < courses.length; i++) {
				for(var j = 0; j < courses[i].outcomes.length; j++) {
					var outcome = outcomeById(courses[i].outcomes[j]);
					courses[i].outcomes[j] = outcome;

					//a form has already been submitted, 
					//so push id to formsInDB
					if(outcome.outcomeEvaluation) {
						formsInDB.push(outcome.outcomeEvaluation._id);
					}
				}
			}
		}

		function courseByNumber(courseNum) {
			for(var i = 0; i < $scope.userCourses.length; i++) {
				if($scope.userCourses[i].courseID == courseNum) {
					var course = $scope.userCourses[i];

					//if course already has a form 
					//push it to formsInDB
					if(course.courseCommitteeEvaluationForm) {
						formsInDB.push(course.courseCommitteeEvaluationForm._id);
						$scope.form = course.courseCommitteeEvaluationForm;
					}
					
					return course;
				}
			}
		}

		function saveToDB(route, body) {
			var d = $q.defer();
			if(formsInDB.indexOf(body._id) != -1) {
				route += '/' + body._id;
				$http.put(route, body).success(function(response) {
					d.resolve(response);
				});
			} else {
				$http.post(route, body).success(function(response) {
					d.resolve(response);
				});
			}

			return d.promise;
		}

		$scope.init = function() {

			initState();

			//need to reevaluate if forms are in db
			formsInDB = [];
			$scope.form = {};

			$q.all([
				$scope.getOutcomes(),
				$scope.getUserCourses()
			]).then(function(data) {
				var course = courseByNumber($stateParams.courseID);
				resolveOutcomes([course]);

				$scope.course = course;
				$scope.outcomes = course.outcomes;
				setFormFields(course);
			})
		};

		$scope.showInstructions = function() {
			var modalInstance = $modal.open({
				templateUrl: 'instructions.html',
				size: 'lg'
    		});
		}


		//state management functions for 
		//multi-page form

		var outcomeNum = -1;
		function initState() {
			//start at first page
			$scope.state = 'committeeEval';
		}

		$scope.nextState = function() {
			$scope.state = 'outcome' + ++outcomeNum;
		}

		$scope.previousState = function() {
			$scope.state = 'outcome' + --outcomeNum;
			if(outcomeNum == -1)
				$scope.state = 'committeeEval';
		}

		$scope.hasNextState = function() {
			return outcomeNum < $scope.outcomes.length-1;
		}

		$scope.hasPreviousState = function() {
			return outcomeNum >= 0;
		}

		$scope.stateIsOutcome = function(outcome) {
			var is = $scope.outcomes.indexOf(outcome) == outcomeNum;
			return is;
		}

		$scope.stateInOutcomeEvals = function() {
			return $scope.state.substring(0,7) == 'outcome';
		}

	});
}());

function arraysIdsEqual(a1, a2) {
	if(a1.length != a2.length)
		return false;

	for(var i = 0; i < a1.length; i++)
		if(a1[i]._id != a2[i]._id)
			return false;

	return true;
}
