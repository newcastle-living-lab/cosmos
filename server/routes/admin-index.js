var settings = require("../includes/settings.js");

exports.method = "get";
exports.route = "/admin(/*)?";

exports.handler = function(req, res) {


	var params = {
		enableReg: settings.get('users.enable_registration'),
		version: res.locals.app_version,
		assets: {
			js: [],
			css: [],
		},
	};

	if (typeof(req.query.ref) !== 'undefined') {
		req.session.returnTo = `/${req.query.ref}`;
		console.log(`Set req.session.returnTo to /${req.query.ref}...`);
	}

	if (process.env.NODE_ENV === 'development') {
		params.assets.js.push('/assets/admin/main.js');
		params.assets.css.push('/assets/admin/main.css');
	} else {
		params.assets.js.push('/assets/admin/main.min.js');
		params.assets.css.push('/assets/admin/main.min.css');
	}


	return res.render('admin.html', params);
};
