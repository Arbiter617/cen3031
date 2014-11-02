'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Course = mongoose.model('Course');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

exports.getCourses = function(req, res) {
	if(!req.user) {
		return res.status(400).send({
			message: 'User not logged in'
		});
	}
	Course.find( { _id: { $in: req.user.courses } } ).exec(function(err, courses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(courses);
		}
	});
};

exports.removeCourse = function(req, res) {
	var user = req.user;

	if(user) {
		var courseIndex = user.courses.indexOf(req.course._id);

		//found element
		if(courseIndex > -1) {
			user.courses.splice(courseIndex, 1);
			user.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(user);
					/*req.login(user, function(err) {
						if (err) {
							res.status(400).send(err);
						} else {
							res.jsonp(user);
						}
					});*/
				}
			});
		} else {
			res.status(400).send({
				message: 'User does not have this course'
			});
		}

	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};
