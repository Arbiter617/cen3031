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
			$location;

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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
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
		}));

		it('$scope.addCourse() with valid course should send a PUT to update user with new course', inject(function(Courses, Users) {
			var sampleCoursePostData = new Courses({
				_id: '525cf20451979dea2c000001',
				courseID: 'cen3031'
			});

			scope.user = new Users({courses:[]});
			$httpBackend.expectPUT(/users/).respond();
			scope.addCourse(sampleCoursePostData);
			
		}))

		it('$scope.create() with valid form data should send a POST request with the form input values', inject(function(Courses) {
			// Create a sample article object
			var sampleCoursePostData = new Courses({
				courseID: 'cen3031'
			});

			// Create a sample article response
			var sampleCourseResponse = new Courses({
				_id: '525cf20451979dea2c000001',
				courseID: 'cen3031'
			});

			// Fixture mock form input values
			scope.courseID = 'cen3031';

			// Set POST response
			$httpBackend.expectPOST('courses', sampleCoursePostData).respond(sampleCourseResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.courseID).toEqual('');

			// Test URL redirection after the article was created
			//expect($location.path()).toBe('/articles/' + sampleArticleResponse._id);
		}));

		it('$scope.update() should update a valid course', inject(function(Courses) {
			// Define a sample article put data
			var sampleCoursePutData = new Courses({
				_id: '525cf20451979dea2c000001',
				courseID: 'cen3031',
			});

			// Mock article in scope
			scope.course = sampleCoursePutData;

			// Set PUT response
			$httpBackend.expectPUT(/courses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			//expect($location.path()).toBe('/articles/' + sampleArticlePutData._id);
		}));

		it('$scope.find() should create an array with at least one course object fetched from XHR', inject(function(Courses) {
			// Create sample article using the Articles service
			var sampleCourse = new Courses({
				courseID: 'cen3031'
			});

			// Create a sample articles array that includes the new article
			var sampleCourses = [sampleCourse];

			// Set GET response
			$httpBackend.expectGET('courses').respond(sampleCourses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.courses).toEqualData(sampleCourses);
		}));

		it('$scope.remove() should send DELETE request with correct courseId', inject(function(Courses) {
			// Create new article object
			var sampleCourse = new Courses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new articles array and include the article
			scope.courses = [sampleCourse];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/courses\/([0-9a-fA-F]{24})$/).respond(204);

			scope.remove(sampleCourse);
			$httpBackend.flush();

			expect(scope.courses.length).toBe(0);
		}));
	});
}());