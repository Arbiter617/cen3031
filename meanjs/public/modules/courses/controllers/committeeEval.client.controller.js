'use strict';
angular.module('courses').controller('committeeEvalController', ['$scope', '$http','$stateParams','$q', 'Authentication','Courses', 'Users', 'Outcomes',
	function($scope, $http, $stateParams,$q, Authentication,Courses,Users,Outcomes) {

		$scope.authentication = Authentication;
		$scope.user = new Users(Authentication.user);
		$scope.form = {};

		$scope.form.instructor = user.firstName + " " +user.lastName;
		$scope.form.date = new Date();

		$scope.submit = function(form) {
			var course = $scope.course;
			course.outcomes = [];

			//promises for saving outcome evals
			var promises = [];

			//save outcome evals and populate course.outcomes with 
			//outcome _id's
			for(var i = 0; i < $scope.outcomes.length; i++) {
				var outcome = $scope.outcomes[i];
				promises.push(defferedPost('outcomeEval', outcome.outcomeEvaluation));
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
			defferedPost('courseCommitteeEvaluation', $scope.form).then(function(data) {
				course.courseCommitteeEvaluationForm = data._id;

				//generate pdf when course saves
				$http.put('courses/' + course._id, course).success(function(response) {
					getPDF(course._id);
				});
			});
		}

		function getPDF(course_id) {
			$http.get('committeePDF/' + course_id).success(function(response) {
				$scope.committeePDF = response;
			});
		}

		function setFormFields(course) {
			$scope.course = course;
			$scope.form.courseNumber = course.courseID;
			$scope.form.courseTitle = course.courseName;
			$scope.form.courseCommitteeParticipants = $scope.form.instructor;
			$scope.outcomes = course.outcomes;
			for(var i = 0; i < course.outcomes.length; i++) {
				course.outcomes[i].outcomeEvaluation = {};
			}
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
				for(var j = 0; j < courses[i].outcomes.length; j++) {
					courses[i].outcomes[j] = outcomeById(courses[i].outcomes[j]);
				}
			}
		}

		function courseByNumber(courseNum) {
			for(var i = 0; i < $scope.userCourses.length; i++) {
				if($scope.userCourses[i].courseID == courseNum)
					return $scope.userCourses[i];
			}
		}

		//post body to route and return promise
		function defferedPost(route, body) {
			var d = $q.defer();
			$http.post(route, body).success(function(response) {
				d.resolve(response);
			});
			return d.promise;
		}

		$scope.init = function() {
			$q.all([
				$scope.getOutcomes(),
				$scope.getUserCourses()
			]).then(function(data) {
				var course = courseByNumber($stateParams.courseID);
				resolveOutcomes([course]);
				setFormFields(course);
			})
		};

	
}]);