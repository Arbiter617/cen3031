'use strict';

// Configuring the Articles module
angular.module('courses').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Manage courses', 'manage-courses');
		Menus.addMenuItem('topbar', 'Admin Manage courses', 'admin-manage-courses');
	}
]);