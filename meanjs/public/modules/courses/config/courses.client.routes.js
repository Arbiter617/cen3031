'use strict';

// Setting up route
angular.module('courses').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listCourses', {
			url: '/list-courses',
			templateUrl: 'modules/courses/views/list-courses.client.view.html'
		}).
		state('evalForm', {
			url: '/outcomes-eval-form',
			templateUrl: 'modules/courses/views/outcomes-eval-form.client.view.html'
		}).
		state('likert', {
			url: '/likert-table',
			templateUrl: 'modules/courses/views/likert-table.client.view.html'
		}).		
		state('manageCourses', {
			url: '/manage-courses',
			templateUrl: 'modules/courses/views/manage-courses.client.view.html'
		});
	}
]);
