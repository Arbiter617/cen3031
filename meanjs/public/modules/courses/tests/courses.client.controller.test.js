'use strict';

(function() {
	// Courses Controller Spec
	describe('CoursesController', function() {
		// Initialize global variables
		var CoursesController,
			Authentication,
			scope,
			$httpBackend,
			$stateParams,
			$location,
			sampleCourse,
			sampleCourseData;

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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, Courses) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Courses controller.
			CoursesController = $controller('CoursesController', {
				$scope: scope
			});

			sampleCourse = new Courses({
				_id: '525cf20451979dea2c000001',
				courseID: 'cen3031',
				courseName: 'soft eng',
				outcomes: []
			});

			sampleCourseData = new Courses({
				courseID: 'cen3031',
				courseName: 'soft eng',
				outcomes: []
			});
		}));
		
		it('$scope.addCourse() with valid course should send a PUT to update user with new course', inject(function(Courses, Users) {
			var userResponse = new Users({courses:[sampleCourse]});

			scope.user = new Users({courses:[]});
			scope.userCourses = [];

			$httpBackend.expectPUT(/users/).respond(userResponse);
			scope.addCourse(sampleCourse);
			$httpBackend.flush();
			
			expect(scope.userCourses).toEqual([sampleCourse]);
		}));

		it('$scope.removeCourse(course) should send delete to /users/course/{_id} and update userCourses', inject(function(Courses, Users) {
			scope.userCourses = [sampleCourse];

			$httpBackend.expectDELETE('users/courses/' + sampleCourse._id).respond(204);
			scope.removeCourse(sampleCourse);
			$httpBackend.flush();

			expect(scope.userCourses).toEqual([]);
		}));

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

		it('$scope.remove() should send DELETE request with correct _id', inject(function(Courses) {
			// Create new courses array and include the course
			scope.courses = [sampleCourse];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/courses\/([0-9a-fA-F]{24})$/).respond(204);

			scope.remove(sampleCourse);
			$httpBackend.flush();

			expect(scope.courses.length).toBe(0);
		}));

		it('$scope.getCourses() should send GET to courses and populate $scope.courses', inject(function(Courses) {

			var sampleCourses = [sampleCourse];

			// Set GET response
			$httpBackend.expectGET('courses').respond(sampleCourses);

			// Run controller functionality
			scope.getCourses();
			$httpBackend.flush();

			// Test scope value
			expect(scope.courses).toEqualData(sampleCourses);
			scope.courses = [];
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

		it('$scope.initUserManageCourses() should call getCourses and getUserCourses and populate $scope.userCourseOptions with courses not in userCourses', inject(function(Courses) {
			
			var sampleCourse2 = new Courses({
				_id: '525cf20451979dea2c000002',
				courseID: 'cop4600',
				courseName: 'OS',
				outcomes: []
			});

			var courses = [sampleCourse, sampleCourse2];
			var userCourses = [sampleCourse];

			$httpBackend.expectGET('courses').respond(courses);
			$httpBackend.expectGET('users/courses').respond(userCourses);

			scope.initUserManageCourses();
			$httpBackend.flush();

			expect(arraysIdsEqual(userCourses, scope.userCourses)).toBe(true);
			expect(arraysIdsEqual(courses, scope.courses)).toBe(true);
			expect(arraysIdsEqual([sampleCourse2], scope.userCourseOptions)).toBe(true);

			scope.courses = [];
			scope.userCourses = [];
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