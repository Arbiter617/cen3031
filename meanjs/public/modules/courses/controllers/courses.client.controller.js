'use strict';

angular.module('courses').controller('CoursesController', ['$scope', '$http', '$stateParams', '$location', '$q', 'Authentication', 'Courses', 'Users',
	function($scope, $http, $stateParams, $location, $q, Authentication, Courses, Users) {
		$scope.authentication = Authentication;
		$scope.showCourseModal = false;
		$scope.user = new Users(Authentication.user);
		$scope.userCourseOptions = [];

		//add course to user's courses list
		$scope.addCourse = function(course) {
			$scope.user.courses.push(course._id);
			$scope.user.$update(function(response) {
				Authentication.user = response;
				$scope.userCourses.push(course);
				$scope.userCourse = '';
				$scope.toggleCourseModal();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//remove course from user's courses list
		$scope.removeCourse = function(course) {
			$http.delete('users/courses/' + course._id, course).success(function(response) {
				Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		//open edit course modal
		$scope.edit = function(course) {
			$scope.submitModal = $scope.update;
			$scope.course = course;
			$scope.toggleCourseModal();
		};

		//open create course modal
		$scope.new = function() {
			$scope.submitModal = $scope.create;
			$scope.toggleCourseModal();
		};

		//create new course in db
		$scope.create = function() {
			var course = new Courses({
				courseID: this.courseID,
				courseName: this.courseName
			});
			course.$save(function(response) {
				$scope.courses.push(response);
				$scope.courseID = '';
				$scope.courseName = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			$scope.toggleCourseModal();
		};

		//update existing course in db
		$scope.update = function() {
			var course = $scope.course;
			course.courseID = this.courseID;
			course.courseName = this.courseName;

			course.$update(function() {
				//$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.course = '';
			});

			$scope.toggleCourseModal();
		};

		//remove existing course from db
		$scope.remove = function(course) {
			course.$delete();

			for (var i in $scope.courses) {
				if ($scope.courses[i] === course) {
					$scope.courses.splice(i, 1);
				}
			}
		};

		//populate $scope.userCourses
		$scope.getUserCourses = function() {
			var d = $q.defer();
			 	$http.get('users/courses').success(function(response) {
						$scope.userCourses = response;
					}).error(function(response) {
						$scope.error = response.message;
					});
					return d.promise;
		};

		//populate $scope.courses
		$scope.getCourses = function() {
			var d = $q.defer();
				$scope.courses = Courses.query();
				return d.promise;
		};

		//init data needed for user manage-courses
		$scope.initUserManageCourses = function() {
			$q.all([
				$scope.getCourses(),
				$scope.getUserCourses()
			]).then(function(data) {
				//courses that user does not have yet
				for(var i = 0; i < $scope.courses.length; i++) {
					if(userCourses.indexOf(courses[i]) == -1) {
						$scope.userCourseOptions.push(courses[i]);
					}
				}
			});
		};

		$scope.toggleCourseModal = function() {
			$scope.showCourseModal = !$scope.showCourseModal;
		};
	
}])

.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
});