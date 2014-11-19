/* Authors: Angel Lee, Raymond Clark */

'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	outcomes = require('../../app/controllers/outcomes');

module.exports = function(app) {
	// Outcome Routes
	app.route('/outcomes')
		.post(users.requiresLogin, outcomes.create)
		.get(outcomes.list);

	app.route('/outcomes/:outcomeId')
		.get(users.requiresLogin, outcomes.hasAuthorization, outcomes.read)
		.put(users.requiresLogin, outcomes.hasAuthorization, outcomes.update)
		.delete(users.requiresLogin, outcomes.hasAuthorization, outcomes.remove);

	// Finish by binding the outcome middleware
	app.param('outcomeId', outcomes.outcomeByID);
};