var auth = require("../includes/auth.js"),
	settings = require("../includes/settings");

exports.method = "get";
exports.route = "/cosmos(/*)?";

exports.handler = function(req, res) {

	var params = {
		version: res.locals.app_version,
		fathom_site_id: settings.get('cosmos.fathom_site_id'),
		auto_save: settings.get('cosmos.auto_save'),
		assets: {
			js: [],
			css: [],
		},
	};

	if (process.env.NODE_ENV === 'development') {
		params.assets.js.push('/assets/cosmos/main.js');
		params.assets.css.push('/assets/cosmos/main.css');
	} else {
		params.assets.js.push('/assets/cosmos/main.min.js');
		params.assets.css.push('/assets/cosmos/main.min.css');
	}

	return res.render('cosmos.html', params);

};
