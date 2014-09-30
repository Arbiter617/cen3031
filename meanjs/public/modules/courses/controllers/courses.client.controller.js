'use strict';

angular.module('courses').controller('CoursesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courses',
	function($scope, $stateParams, $location, Authentication, Courses) {
		$scope.authentication = Authentication;
		$scope.showCourseModal = false;

		$scope.create = function() {
			var course = new Courses({
				courseID: this.courseID
			});
			course.$save(function(response) {
				//reload courses
				$scope.courses = Courses.query();

				$scope.courseID = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			$scope.toggleCourseModal();
		};

		$scope.edit = function(course) {
			$scope.submitModal = $scope.update;
			$scope.course = course;
			$scope.toggleCourseModal();
		};

		$scope.new = function() {
			$scope.submitModal = $scope.create;
			$scope.toggleCourseModal();
		};

		$scope.update = function() {
			var course = $scope.course;
			course.courseID = this.courseID;

			course.$update(function() {
				//$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.course = '';
			});

			$scope.toggleCourseModal();
		};

		$scope.remove = function(course) {

			//Courses.delete({courseId:Id});
			//$scope.courseId = course._id;
			if (course) {
				course.$delete();

				for (var i in $scope.courses) {
					if ($scope.courses[i] === course) {
						$scope.courses.splice(i, 1);
					}
				}
			} else {
				console.log('\n\n\n\n remove null course why \n\n\n\n');
				//$scope.article.$remove(function() {
				//	$location.path('articles');
				//});
			}
		};

		$scope.find = function() {
			$scope.courses = Courses.query();
		};

		$scope.toggleCourseModal = function() {
			$scope.showCourseModal = !$scope.showCourseModal;
		};
	}
])

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