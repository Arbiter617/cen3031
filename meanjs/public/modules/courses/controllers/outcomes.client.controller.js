/* Authors: Angel Lee, Raymond Clark */

'use strict';

angular.module('courses').controller('OutcomesController', ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Courses', 'Outcomes', 
	function($scope, $stateParams, $location, $modal, Authentication, Courses, Outcomes) {
		$scope.Authentication = Authentication;
		$scope.outcomeIndex = 0;

		var submitModal = '';
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

		// calls update and sets edited outcome
		$scope.edit = function(outcome) {
			submitModal = $scope.update;
			$scope.outcome = outcome;

			var params = {
				outcomeID: outcome.outcomeID,
				outcomeName: outcome.outcomeName,
				header: 'Edit Outcome'
			};
			openModal(params);
		};

		// calls create
		$scope.addOutcome = function() {
			submitModal = $scope.create;
			openModal({ header: 'Add Outcome' });
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

		function openModal(params) {
			var modalInstance = $modal.open({
				templateUrl: 'OutcomeModal.html',
				controller: 'OutcomeModalController',
				size: '',
				resolve: {
					params: function () {
						return params;
					}
				}
    		});

			modalInstance.result.then(function (outcomeData) {
				submitModal(outcomeData);
			}); 
		}
	}

])
.controller('OutcomeModalController', function ($scope, $modalInstance, params) {
	$scope.header = params.header;

	$scope.outcome = {
		outcomeID: params.outcomeID,
		outcomeName: params.outcomeName
	};

	$scope.submit = function (outcome) {
		$modalInstance.close(outcome);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});;