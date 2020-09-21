var passport = require("passport"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types");

exports.method = "post";
exports.route = "/api/auth/session";

exports.handler = function(req, res, next) {

	passport.authenticate("local", function(err, user, info, status) {

		// console.log(err);
		// console.log(user);
		// console.log(info);
		// console.log(status);

		if (err) { return next(err) }

		if ( ! user || (user && user.status != 10)) {
			return res.status(403).send({
				'success': false,
				'reason': 'bad_username_password',
			});
		}

		req.logIn(user, {}, function(err) {

			eventLog.log({
				"type": eventType.LOG_IN,
				"req": req,
				"user": user
			});

			return res.send({
				'success': true,
				'foo': 'bar',
				// 'returnTo': null,
				'returnTo': req.session.returnTo ? req.session.returnTo : null,
			});

		});


	})(req, res, next);

};

/*
	req.logIn(user, {}, function(err) {

		eventLog.log({
			"type": eventType.LOG_IN,
			"req": req,
			"user": user
		});

		if (req.body.ref && req.body.ref.length) {
			return res.redirect(req.body.ref);
		}

		return res.redirect('/');
	});*/
