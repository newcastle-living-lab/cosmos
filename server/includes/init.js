var fs = require("fs"),
	path = require("path"),
	crypto = require("crypto"),
	database = require("./database.js"),
	settings = require("./settings.js");
	mailer = require("./mailer.js");


var init = function() {

	database.init();
	mailer.init();

	settings.init()
		.then(() => {

			// Add a default value for the users.verify_secret.
			var secret = settings.get('users.verify_secret');
			if ( ! secret || secret.length === 0) {
				settings.set('users.verify_secret', crypto.randomBytes(32).toString('hex'), 'string').then(() => {
					console.log("Settings: Set initial value for `users.verify_secret`.");
				});
			}

		});
}


module.exports = init;
