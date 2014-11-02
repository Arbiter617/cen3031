/* Authors: Angel Lee, Raymond Clark */

'use strict';

angular.module('courses').controller('OutcomesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courses', 'Outcomes', 
	function($scope, $stateParams, $location, Authentication, Courses, Outcomes) {
		$scope.Authentication = Authentication;
		$scope.outcomeIndex = 0;
		//$scope.information = "";

		$scope.getOutcomeIndex = function(index) {
			$scope.outcomeIndex = index;
		};

		// query the db for the outcomes
		$scope.find = function() {
			$scope.outcomes = Outcomes.query();
			$scope.courses = Courses.query();
		};

		// creates outcomes via ID and name and saves
		$scope.create = function() {
			var outcome = new Outcomes({
				outcomeID: this.outcomeID,
				outcomeName: this.outcomeName
			});

			outcome.$save(function(response) {
				$scope.outcomes = Outcomes.query();
				$scope.outcomeID = '';
				$scope.outcomeName = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			$scope.toggleOutcomeModal();
		};

		// updates the outcome description
		$scope.update = function() {
			var outcome = $scope.outcome;
			outcome.outcomeID = this.outcomeID;
			outcome.outcomeName = this.outcomeName;
			outcome.$update(function() {

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				$scope.outcome = '';
			});

			$scope.toggleOutcomeModal();
		};

		// calls update and sets edited outcome
		$scope.edit = function(outcome) {
			$scope.submitModal = $scope.update;
			$scope.outcome = outcome;
			$scope.toggleOutcomeModal();
			$scope.information = "Edit Outcome";
			$scope.namePlaceholder = outcome.outcomeName;
			$scope.IDPlaceholder = outcome.outcomeID;
		};

		// calls create
		$scope.addOutcome = function() {
			$scope.submitModal = $scope.create;
			$scope.toggleOutcomeModal();
			$scope.information = "Add Outcome";
			$scope.namePlaceholder = "";
			$scope.IDPlaceholder = "";
		};


		// boolean 
		$scope.toggleShowDiv = function() {
			$scope.clicked = !$scope.clicked;
		};

		$scope.toggleOutcomeModal = function() {
			$scope.showOutcomeModal = !$scope.showOutcomeModal;
		};

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
	}

]);