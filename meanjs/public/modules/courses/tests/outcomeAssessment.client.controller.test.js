'use strict';

(function() {
	// Courses Controller Spec
	describe('outcomeAssessmentController', function() {
		// Initialize global variables
		var OutcomeAssessmentController,
			Authentication,
			scope,
			$httpBackend,
			$stateParams,
			$location,
			sampleOutcomeAssessment,
			sampleOutcomeAssessmentData;

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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, Outcomes) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Courses controller.
			OutcomesAssessmentController = $controller('OutcomesAssessmentController', {
				$scope: scope
			});

			sampleOutcomeAssessment = new outcomeAssessmentForm({
           		name = 'a', 
            	data = '',
            	likert = '3',
            	courseNumber = 'CEN 3031',
            	courseTitle = 'Software Engineering';
			});

			sampleOutcomeAssessmentData = new outcomeAssessmentForm({
           		name = 'a', 
            	data = '',
            	likert = '3',
            	courseNumber = 'CEN 3031',
            	courseTitle = 'Software Engineering';
			});
		}));
		
		$scope.submit = function() {			
			var reader = new FileReader();
			var d = $q.defer();
            reader.addEventListener("loadend", function(evt) {
            	parseCSV(d,reader);
            });
            reader.readAsText($scope.files[0]);
		}

		function parseCSV(d,reader) {
			$http.post('csv_parsing/', { 
            	name: $scope.files[0].name, 
            	data: reader.result,
            	likert: $scope.likert,
            	courseNumber: $scope.courseNumber,
            	courseTitle: $scope.courseTitle
            }).success(function(res) {
            	$scope.outcomeAssessmentForm = res;
            	d.resolve();
            }).err(function(res) {
            	$scope.error = res.message;
            });
            return d.promise;
		}

		$scope.getUserCourses = function() {
			var d = $q.defer();
		 	$http.get('users/courses').success(function(response) {
				$scope.userCourses = response;
				d.resolve();
			}).error(function(response) {
				$scope.error = response.message;
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
				if($stateParams.courseID == courses[i].courseID){
					$scope.courseTitle = courses[i].courseName;
				}
				for(var j = 0; j < courses[i].outcomes.length; j++) {
					courses[i].outcomes[j] = outcomeById(courses[i].outcomes[j]);
					if(courses[i].outcomes[j].outcomeID==$stateParams.outcomeID){
						$scope.description =courses[i].outcomes[j].outcomeName;
					}

				}
			}
		}
		$scope.init = function() {
			$q.all([
				$scope.getOutcomes(),
				$scope.getUserCourses()
			]).then(function(data) {
				resolveOutcomes($scope.userCourses);
			})
		};		
	

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
