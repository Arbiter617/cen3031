'use strict';

angular.module('courses').controller('CoursesController', ['$scope', '$http', '$stateParams', '$location', '$modal', '$q', 'Authentication', 'Courses', 'Users', 'Outcomes',
	function($scope, $http, $stateParams, $location, $modal, $q, Authentication, Courses, Users, Outcomes) {
		$scope.authentication = Authentication;
		$scope.showCourseModal = false;
		$scope.user = new Users(Authentication.user);
		$scope.userCourseOptions = [];
		$scope.selectedOutcomes = [];

		var submitModal = '';

		//add course to user's courses list
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

		//remove course from user's courses list
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

		//open edit course modal
		$scope.edit = function(course) {
			submitModal = $scope.update;
			$scope.course = course;

			var outcomes = [];
			for(var i = 0; i < $scope.outcomes.length; i++) {
				outcomes[i] =  angular.copy($scope.outcomes[i]);
				if(course.outcomes.indexOf($scope.outcomes[i]) != -1)
					outcomes[i].ticked = true;
			}

			openModal({
				courseID: course.courseID,
				courseName: course.courseName,
				outcomes: outcomes
			});
		};

		//open create course modal
		$scope.new = function() {
			submitModal = $scope.create;
			openModal({ outcomes:$scope.outcomes });
		};

		function buildCourse(course, courseData) {
			course.courseID = courseData.courseID;
			course.courseName = courseData.courseName;
			course.outcomes = courseData.outcomes;
		}

		//create new course in db
		$scope.create = function(courseData) {
			var course = new Courses();
			buildCourse(course, courseData);

			course.$save(function(response) {
				$scope.courses.push(course);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//update existing course in db
		$scope.update = function(courseData) {
			var course = $scope.course;
			buildCourse(course, courseData);

			course.$update(function() {
				resolveOutcomes([course]);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.course = '';
			});
		};

		//remove existing course from db
		//	**should be updated to remove course
		//	from users subscribed to it also**
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
			$scope.courses = Courses.query(function(data) {
				d.resolve();
			});
			return d.promise;
		};

		//populate outcomes
		$scope.getOutcomes = function() {
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
			$q.all([
				$scope.getCourses(),
				$scope.getOutcomes()
			]).then(function(data) {
				resolveOutcomes($scope.courses);
				resetModal();
			});
			
		}

		$scope.initListCourses = function() {
			$q.all([
				$scope.getOutcomes(),
				$scope.getUserCourses()
			]).then(function(data) {
				resolveOutcomes($scope.userCourses);
			})
		};

		function openModal(params) {
			var modalInstance = $modal.open({
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				size: '',
				resolve: {
					params: function () {
						return params;
					}
				}
    		});

			modalInstance.result.then(function (courseData) {
				submitModal(courseData);
			}); 
		}

		function outcomeById(id) {
			for(var i = 0; i < $scope.outcomes.length; i++) {
				if($scope.outcomes[i]._id === id)
					return $scope.outcomes[i];
			}
		};

		//take list of courses with list of outcome _id's
		//and replace with actual outcome objects from
		//$scope.outcomes
		function resolveOutcomes(courses) {
			for(var i = 0; i < courses.length; i++) {
				for(var j = 0; j < courses[i].outcomes.length; j++) {
					courses[i].outcomes[j] = outcomeById(courses[i].outcomes[j]);
				}
			}
		}

		function indexById(list, element) {
			for(var i = 0; i < list.length; i++) {
				if(list[i]._id == element._id)
					return i;
			}
			return -1;
		}

		function removeArray(array, element) {
			var i = array.indexOf(element);
			if(i !== -1)
				array.splice(i, 1);
		}
	
}])

.controller('ModalInstanceCtrl', function ($scope, $modalInstance, params) {

	$scope.outcomes = params.outcomes;
	$scope.course = {
		courseID: params.courseID,
		courseName: params.courseName
	}


	$scope.submit = function (course) {
		var outcomes = [];

		for(var i = 0; i < $scope.outcomes.length; i++)
			if($scope.outcomes[i].ticked)
				outcomes.push($scope.outcomes[i]._id);

		course.outcomes = outcomes;

		$modalInstance.close(course);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});