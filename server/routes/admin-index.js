var settings = require("../includes/settings.js");

exports.method = "get";
exports.route = "/admin(/*)?";

exports.handler = function(req, res) {

	var enableReg = settings.get('users.enable_registration');

	// console.log(req.query.ref);
	// console.log(req.session.returnTo);
	if (typeof(req.query.ref) !== 'undefined') {
		req.session.returnTo = `/${req.query.ref}`;
		console.log(`Set req.session.returnTo to /${req.query.ref}...`);
	}

	const params = {
		enableReg: enableReg
	};

	return res.render('admin.html', params);
};
