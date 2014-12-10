'use strict';

(function() {
	// Courses Controller Spec
	describe('Committee Eval Controller', function() {
		// Initialize global variables
		var CommitteeController,
			Authentication,
			scope,
			$httpBackend,
			$stateParams,
			$location,
			sampleCourse,
			sampleOutcome;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, Courses, Outcomes) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Courses controller.
			CommitteeController = $controller('committeeEvalController', {
				$scope: scope
			});
			sampleCourse = new Courses({
				_id: '525cf20451979dea2c000001',
				courseID: 'cen3031',
				courseName: 'soft eng',
				outcomes: []
			});
			sampleOutcome = new Outcomes({
				_id:' 525cf20451979dea2c000002',
				outcomeID: 'a',
				outcomeName: 'outcomeA'
			});

		}));
		it('$scope.getUserCourses() should send GET to users/courses and populate $scope.userCourses', inject(function(Courses) {

			var sampleCourses = [sampleCourse];

			// Set GET response
			$httpBackend.expectGET('users/courses').respond(sampleCourses);

			// Run controller functionality
			scope.getUserCourses();
			$httpBackend.flush();

			// Test scope value
			expect(scope.userCourses).toEqualData(sampleCourses);
			scope.userCourses = [];
		}));
		it('scope.getOutcomes should send GET and populate scope.outcomes', inject(function() {

			var sampleOutcomes = [sampleOutcome];

			$httpBackend.expectGET('outcomes').respond(sampleOutcomes);

			scope.getOutcomes();
			$httpBackend.flush();

			expect(scope.outcomes).toEqualData(sampleOutcomes);
			scope.outcomes = [];
		}));
		it('nextState should go from committeeEval to outcomes0', inject(function() {

			scope.state = 'committeeEval';
			scope.nextState();
			
			expect(scope.state).toEqual('outcome0');
		}));
		it('nextState should go from outcomes0 to outcomes1', inject(function() {

			scope.state = 'committeeEval';
			scope.nextState();
			scope.nextState();
			
			expect(scope.state).toEqual('outcome1');
		}));
		it('hasNextState should return true before nextState() with 1 outcome', inject(function() {

			scope.state = 'committeeEval';
			scope.outcomes = {length:1};
			
			expect(scope.hasNextState()).toEqual(true);
		}));
		it('hasNextState should return false before nextState() with 0 outcomes', inject(function() {

			scope.state = 'committeeEval';
			scope.outcomes = {length:0};
			
			expect(scope.hasNextState()).toEqual(false);
		}));
		it('hasPreviousState should return false before nextState()', inject(function() {

			scope.state = 'committeeEval';
			
			expect(scope.hasPreviousState()).toEqual(false);
		}));
		it('hasPreviousState should return true after nextState()', inject(function() {

			scope.state = 'committeeEval';
			scope.nextState();
			
			expect(scope.hasPreviousState()).toEqual(true);
		}));
		it('stateIsOutcome should return true if outcome is equal to outcomeNum', inject(function() {

			scope.state = 'committeeEval';
			scope.nextState();
			scope.nextState();
			scope.outcomes = ['outcomeTest1','outcomeTest2']			
			expect(scope.stateIsOutcome('outcomeTest2')).toEqual(true);
		}));
		it('stateIsOutcome should return false if outcome is not equal to outcomeNum', inject(function() {

			scope.state = 'committeeEval';
			scope.nextState();
			scope.nextState();
			scope.outcomes = ['outcomeTest1','outcomeTest2']			
			expect(scope.stateIsOutcome('outcomeTest1')).toEqual(false);
		}));
		it('stateInOutcomeEvals should return true if state is in outcomes', inject(function() {

			scope.state = 'outcome0';			
			expect(scope.stateInOutcomeEvals()).toEqual(true);
		}));
		it('stateInOutcomeEvals should return false if state is not in outcomes', inject(function() {

			scope.state = 'committeeEval';			
			expect(scope.stateInOutcomeEvals()).toEqual(false);
		}));
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