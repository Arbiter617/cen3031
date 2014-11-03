'use strict';

angular.module('courses').controller('CoursesController', ['$scope', '$http', '$stateParams', '$location', '$q', 'Authentication', 'Courses', 'Users', 'Outcomes',
	function($scope, $http, $stateParams, $location, $q, Authentication, Courses, Users, Outcomes) {
		$scope.authentication = Authentication;
		$scope.showCourseModal = false;
		$scope.user = new Users(Authentication.user);
		$scope.userCourseOptions = [];
		$scope.selectedOutcomes = [];

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
			$scope.courseID = course.courseID;
			$scope.courseName = course.courseName;
			//$scope.selectedOutcomes = course.outcomes;
			$scope.toggleCourseModal();
		};

		//open create course modal
		$scope.new = function() {
			$scope.submitModal = $scope.create;
			$scope.toggleCourseModal();
		};

		//create new course in db
		$scope.create = function() {
			var outcomes = [];
			for(var i = 0; i < $scope.selectedOutcomes.length; i++) {
				outcomes.push($scope.selectedOutcomes[i]._id);
			}

			var course = new Courses({
				courseID: this.courseID,
				courseName: this.courseName,
				outcomes: outcomes
			});
			course.$save(function(response) {
				$scope.initAdminManageCourses();
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
						d.resolve();
					}).error(function(response) {
						$scope.error = response.message;
					});
					return d.promise;
		};

		//populate $scope.courses
		$scope.getCourses = function() {
			var d = $q.defer();
			$scope.courses = Courses.query(function() {
				d.resolve();
			});
			return d.promise;
		};

		function getOutcomes() {
			var d = $q.defer();
			$scope.outcomes = Outcomes.query(function() {
				d.resolve();
			});
			return d.promise;
		}

		//init data needed for user manage-courses
		$scope.initUserManageCourses = function() {
			$q.all([
				$scope.getCourses(),
				$scope.getUserCourses()
			]).then(function(data) {
				//courses that user does not have yet
				for(var i = 0; i < $scope.courses.length; i++) {
					if(indexById($scope.userCourses, $scope.courses[i]) == -1) {
						$scope.userCourseOptions.push($scope.courses[i]);
					}
				}
			});
		};

		//init data needed for admin manage-courses
		$scope.initAdminManageCourses = function() {
			$scope.getCourses();
			$scope.outcomes = Outcomes.query();
		}

		$scope.initListCourses = function() {
			$q.all([
				getOutcomes(),
				$scope.getUserCourses()
			]).then(function(data) {
				for(var i = 0; i < $scope.userCourses.length; i++) {
					for(var j = 0; j < $scope.userCourses[i].outcomes.length; j++) {
						$scope.userCourses[i].outcomes[j] = outcomeById($scope.userCourses[i].outcomes[j]);
					}
				}
			})
		}

		$scope.outcomeSelect = function(outcome) {
			$scope.selectedOutcomes.push(outcome);
			var i = $scope.outcomes.indexOf(outcome);
			if (i >= 0) {
				$scope.outcomes.splice(i, 1);
			}
		}

		$scope.outcomeRemove = function( outcome ) {
			var i = $scope.selectedOutcomes.indexOf(outcome);
			if (i >= 0) {
				$scope.selectedOutcomes.splice(i, 1);
				$scope.outcomes.push(outcome);
			}
		}

		$scope.toggleCourseModal = function() {
			$scope.showCourseModal = !$scope.showCourseModal;
			if(!$scope.showCourseModal) {
				$scope.course = '';
				$scope.courseID = '';
				$scope.courseName = '';
				$scope.selectedOutcomes = [];
			}
		};

		function outcomeById(id) {
			for(var i = 0; i < $scope.outcomes.length; i++) {
				if($scope.outcomes[i]._id === id)
					return $scope.outcomes[i];
			}
		}

		function indexById(list, element) {
			for(var i = 0; i < list.length; i++) {
				if(list[i]._id == element._id)
					return i;
			}
			return -1;
		}
	
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