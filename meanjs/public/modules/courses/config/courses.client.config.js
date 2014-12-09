'use strict';

// Configuring the Articles module
angular.module('courses').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Manage Courses', 'manage-courses');
		Menus.addMenuItem('topbar', 'Admin Manage Courses', 'manage-courses-admin', 'item', '/manage-courses-admin', 'true', ['admin']);
		Menus.addMenuItem('topbar', 'Manage Outcomes', 'manage-outcomes', 'item', '/manage-outcomes', 'true', ['admin']);
	}
]);