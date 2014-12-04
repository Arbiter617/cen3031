'use strict';
angular.module('courses').controller('outcomeAssessmentController', ['$scope', '$http','$stateParams','$q', 'Authentication','Courses', 'Users', 'Outcomes',
	function($scope, $http, $stateParams,$q, Authentication,Courses,Users,Outcomes) {
		$scope.authentication = Authentication;
		$scope.user = new Users(Authentication.user);
		$scope.form = {};
		$scope.userCourses;
		$scope.outcomes;
		$scope.outcome={};
		$scope.description;
		$scope.parsedCSV;

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
            	likert: $scope.likert
            }).success(function(res) {
            	$scope.parsedCSV = res;
            	$scope.outcome.outcomeAssessmentForm.numberOfStudents= $scope.parsedCSV.numberOfStudents;
            	$scope.outcome.outcomeAssessmentForm.gradingScale=  $scope.parsedCSV.gradingScale;
            	$scope.outcome.outcomeAssessmentForm.averageScore=  $scope.parsedCSV.averageScore;
            	$scope.outcome.outcomeAssessmentForm.minimumAcceptableLikertValue=  $scope.parsedCSV.minimumAcceptableLikertValue;
            	$scope.outcome.outcomeAssessmentForm.percentageAchievingOutcome =  $scope.parsedCSV.percentageAchievingOutcome;
            	$scope.outcome.outcomeAssessmentForm.averageLikertScore=  $scope.parsedCSV.averageLikertScore;
            	d.resolve();
            }).err(function(res) {
            	$scope.error = res.message;
            });
            return d.promise;
		}

		$scope.generate = function(){
			var body = {};
			body._id = "test";
			body.data = "doo"
			var htlm  = document.getElementById("form");
			body.data = htlm.innerHTML;
			console.log(body.data);
			$http.post('/outcomePDF', body).success(function(response) {
				

			}).error(function(response) {
				console.log(response);
			});
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
					var _cID=courses[i]._id;

				}
				for(var j = 0; j < courses[i].outcomes.length; j++) {
					courses[i].outcomes[j] = outcomeById(courses[i].outcomes[j]);
					if(courses[i].outcomes[j].outcomeID==$stateParams.outcomeID){
						if(courses[i]._id==_cID){
							$scope.outcome= courses[i].outcomes[j];
							initForm();
						}
					}

				}
			}
		}
		function initForm(){
			
			createForm().then(function(){
			
				$scope.outcome.outcomeAssessmentForm.courseNumber=$stateParams.courseID;
				$scope.outcome.outcomeAssessmentForm.courseTitle=$scope.courseTitle;
				$scope.outcome.outcomeAssessmentForm.instructor = user.firstName +" " +user.lastName;
				$scope.outcome.outcomeAssessmentForm.date = new Date();
				var path ='/courseOutcomeAssessment/'+$scope.outcome.outcomeAssessmentForm._id;
				$http.put(path,$scope.outcome.outcomeAssessmentForm).success(function(response){

				}).error(function(response){
					console.log(response);
				});
			});
		}
		function createForm(){
			var d= $q.defer()
			if(!$scope.outcome.outcomeAssessmentForm){
				
				$scope.outcome.outcomeAssessmentForm={};
				$scope.outcome.outcomeAssessmentForm.courseNumber=$stateParams.courseID;
				$scope.outcome.outcomeAssessmentForm.courseTitle=$scope.courseTitle;
				$scope.outcome.outcomeAssessmentForm.instructor = user.firstName +" " +user.lastName;
				$scope.outcome.outcomeAssessmentForm.date = new Date();
				$http.post('/courseOutcomeAssessment', $scope.outcome.outcomeAssessmentForm).success(function(response) {
					console.log(response);
					$scope.outcome.outcomeAssessmentForm=response;
					d.resolve();
				}).error(function(response) {
					console.log(response);
				});
			}
			else
				d.resolve();
			return d.promise;
		}
		$scope.init = function() {
			$q.all([
				$scope.getOutcomes(),
				$scope.getUserCourses()
			]).then(function(data) {
				resolveOutcomes($scope.userCourses);
			})
		};

	
}])
.directive('fileInput', ['$parse', function($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attributes) {
			element.bind('change', function() {
				$parse(attributes.fileInput)
				.assign(scope, element[0].files);
				scope.$apply();
			})
		}
	}
}]);