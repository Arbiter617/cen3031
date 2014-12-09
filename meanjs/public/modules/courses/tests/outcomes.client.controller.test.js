'use strict';

(function() {
	// Courses Controller Spec
	describe('OutcomesController', function() {
		// Initialize global variables
		var OutcomesController,
			Authentication,
			scope,
			$httpBackend,
			$stateParams,
			$location,
			sampleOutcomes,
			sampleOutcomesData;

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
			OutcomesController = $controller('OutcomesController', {
				$scope: scope
			});

			sampleCourse = new Outcomes({
				outcomeID: 'a)',
				outcomeName: 'critical thinking';
			});

			sampleCourseData = new Outcomes({
				outcomeID: 'a)',
				outcomeName: 'crtitical thinking';
			});
		}));
		
		//add course to user's courses list//////////////////////////////////////////////////////
		$scope.addCourse = function(course) {
			$scope.user.courses.push(course._id);
			$scope.user.$update(function(response) {
				Authentication.user = response;
				$scope.user = new Users(Authentication.user);

				$scope.userCourses.push(course);
				$scope.userCourse = '';
				removeArray($scope.userCourseOptions, course);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		it('$scope.addCourse() with valid course should send a PUT to update user with new course', inject(function(Courses, Users) {
			var userResponse = new Users({courses:[sampleCourse]});

			scope.user = new Users({courses:[]});
			scope.userCourses = [];

			$httpBackend.expectPUT(/users/).respond(userResponse);
			scope.addCourse(sampleCourse);
			$httpBackend.flush();
			
			expect(scope.userCourses).toEqual([sampleCourse]);
		}));
		it('$scope.addOutcome() with valid outcome should openModal with header "Add Outcome"', inject(function(Outcomes) {

		}));	
		// calls create
		$scope.addOutcome = function() {
			submitModal = $scope.create;
			openModal({ header: 'Add Outcome' });
		};

		//remove course from user's courses list//////////////////////////////////////////////////////
		$scope.removeCourse = function(course) {
			$http.delete('users/courses/' + course._id, course).success(function(response) {
				Authentication.user = response;
				$scope.user = new Users(Authentication.user);

				removeArray($scope.userCourses, course);
				$scope.userCourseOptions.push(course);
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		it('$scope.removeCourse(course) should send delete to /users/course/{_id} and update userCourses', inject(function(Courses, Users) {
			scope.userCourses = [sampleCourse];

			$httpBackend.expectDELETE('users/courses/' + sampleCourse._id).respond(204);
			scope.removeCourse(sampleCourse);
			$httpBackend.flush();

			expect(scope.userCourses).toEqual([]);
		}));
		it('$scope.removeOutcome(outcome) should send delete and update outcomes', inject(function(Outcomes) {
			scope.outcomes = [sampleOutcomes];

			$httpBackend.expectDELETE('users/courses/' + sampleCourse._id).respond(204);
			scope.removeCourse(sampleCourse);
			$httpBackend.flush();

			expect(scope.userCourses).toEqual([]);
		}));		
		//removes outcome from db
		$scope.removeOutcome = function(outcome) {
			if (outcome) {
				outcome.$delete();

				for (var i in $scope.outcomes) {
					if ($scope.outcomes[i] === outcome) {
						$scope.outcomes.splice(i, 1);
					}
				}
			} 
		};		

		//create new course in db//////////////////////////////////////////////////////
		$scope.create = function(courseData) {
			var course = new Courses();
			buildCourse(course, courseData);

			course.$save(function(response) {
				$scope.courses.push(course);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		it('$scope.create() with valid form data should send a POST request with the form input values and GET courses', inject(function(Courses) {

			// Fixture mock form input values
			scope.showCourseModal = true;
			scope.courseID = 'cen3031';
			scope.courseName = 'soft eng';
			scope.selectedOutcomes = [];

			// Set POST response
			$httpBackend.expectPOST('courses', sampleCourseData).respond(sampleCourse);
			$httpBackend.expectGET('courses').respond([sampleCourse]);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.courseID).toEqual('');
			expect(scope.courseName).toEqual('');
			expect(scope.selectedOutcomes).toEqual([]);
			expect(scope.courses[0]._id)

			// Test URL redirection after the article was created
			//expect($location.path()).toBe('/articles/' + sampleArticleResponse._id);
		}));
		// creates outcomes via ID and name and saves
		$scope.create = function(outcomeData) {
			var outcome = new Outcomes({
				outcomeID: outcomeData.outcomeID,
				outcomeName: outcomeData.outcomeName
			});

			outcome.$save(function(response) {
				$scope.outcomes.push(outcome);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};		

		//update existing course in db//////////////////////////////////////////////////////
		$scope.update = function(courseData) {
			var course = $scope.course;

			var newOutcomes = [];
			for(var i = 0; i < courseData.outcomes.length; i++) {
				var outcome = outcomeById(courseData.outcomes[i]);
				if(course.outcomes.indexOf(outcome) == -1) {
					newOutcomes.push(outcome);
				}
			}

			$http.post('courses/' + course._id + '/outcomes', newOutcomes)
				.success(function(response) {
					courseData = response;
					buildCourse(course, courseData);
					course.$update(function() {
						resolveOutcomes([course]);
					}, function(errorResponse) {
						$scope.error = errorResponse.data.message;
						$scope.course = '';
					});
				}).error(function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
		};
		it('$scope.update() should send PUT with correct info', inject(function(Courses) {

			// Mock article in scope
			scope.course = sampleCourse;
			scope.showCourseModal = true;

			// Set PUT response
			$httpBackend.expectPUT(/courses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.courseID).toEqual('');
			expect(scope.courseName).toEqual('');
			expect(scope.selectedOutcomes).toEqual([]);
			expect(scope.course).toEqual('');

			scope.course = '';
		}));
		// updates the outcome description
		$scope.update = function(outcomeData) {
			var outcome = $scope.outcome;
			outcome.outcomeID = outcomeData.outcomeID;
			outcome.outcomeName = outcomeData.outcomeName;
			outcome.$update(function() {
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			$scope.outcome = '';
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
