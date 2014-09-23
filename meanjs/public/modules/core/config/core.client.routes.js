'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		});

		$stateProvider.
		state('classes', {
			url: '/classes',
			templateUrl: 'modules/core/views/classes.client.view.html'
		});
	}
]);