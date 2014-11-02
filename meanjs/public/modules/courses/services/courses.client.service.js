'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('courses').factory('Courses', ['$resource',
	function($resource) {
		return $resource('courses/:courseId', {
			courseId: '@_id'
		}, {
			update: { method: 'PUT' }
		});
	}
]);