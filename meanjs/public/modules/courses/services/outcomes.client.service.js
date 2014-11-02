/* Authors: Angel Lee, Raymond Clark */

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('courses').factory('Outcomes', ['$resource',
	function($resource) {
		return $resource('outcomes/:outcomeId', {
			outcomeId: '@_id'
		}, {
			update: { method: 'PUT' }
		});
	}
]);