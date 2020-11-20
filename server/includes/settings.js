var fs = require("fs"),
	path = require("path"),
	bindAll = require('lodash/bindAll'),
	database = require("./database");

/**
 * Settings keys and their types.
 *
 */
const SETTINGS = {
	"smtp.host": "string",
	"smtp.port": "integer",
	"smtp.secure": "boolean",
	"smtp.auth_user": "string",
	"smtp.auth_pass": "string",
	"smtp.from_email": "string",
	"smtp.from_name": "string",
	"users.enable_registration": "boolean",
	"cosmos.fathom_site_id": "string",
	"cosmos.auto_save": "boolean",
};


var Settings = function() {
	var data = {};
	bindAll(this, [
		'init',
		'ensureDefaults',
		'importFromFile',
		'reloadSettings',
		'getSettings',
		'wakeValue',
		'sleepValue',
		'get',
		'getAll',
		'set',
	]);
}


Settings.prototype.init = function() {
	return this.ensureDefaults()
		.then(this.reloadSettings)
		.then(this.importFromFile);
}


/**
 * Get single or multiple settings
 *
 * @param string|array of keys
 *
 */
Settings.prototype.get = function(key) {
	if (Array.isArray(key)) {
		var value = {};
		key.forEach(key => {
			value[key] = typeof(this.data[key]) === 'undefined' ? null : this.data[key]['value'];
		});
		return value;
	} else {
		return typeof(this.data[key]) === 'undefined' ? null : this.data[key]['value'];
	}
};


/**
 * Get all settings
 *
 */
Settings.prototype.getAll = function() {
	var settings = {};
	for (const key in this.data) {
		settings[key] = this.data[key]['value'];
	}
	return settings;
};


/**
 * Insert (or ignore) the default settings to ensure the types are set correctly.
 *
 */
Settings.prototype.ensureDefaults = function() {

	var self = this;

	return new Promise(function(resolve, reject) {

		var sql = "INSERT OR IGNORE INTO settings(`key`, `value`, `type`) VALUES ($key, $value, $type)";
		var db = database.getDb();
		var stmt = db.prepare(sql);

		var keys = Object.keys(SETTINGS),
			params = {},
			inserted = 0;

		keys.forEach(function(key) {

			console.log(`Registering setting ${key}...`);

			params = {
				$key: key,
				$type: SETTINGS[key],
				$value: null,
			};

			stmt.run(params, function(err) {
				inserted++;
				if (inserted >= keys.length) {
					resolve();
				}
			});

		});

	});

}


/**
 * Reload all the DB settings into local cache.
 * Call this after every insert/update/delete.
 *
 */
Settings.prototype.reloadSettings = function() {
	return this.getSettings().then(settings => this.data = settings);
}


/**
 * Get all current settings from database.
 *
 * Values are returned in { key: value } format, with the value properly formatted according to the type.
 *
 */
Settings.prototype.getSettings = function() {

	var self = this;

	return new Promise(function(resolve, reject) {

		var sql = "SELECT * FROM `settings`";
		var db = database.getDb();
		var stmt = db.prepare(sql);

		stmt.all(function(err, rows) {

			stmt.finalize();

			if (err) return reject(err);

			var settings = {};
			rows.forEach(function(row) {
				var formattedRow = self.wakeValue(row);
				settings[ formattedRow.key ] = {
					type: formattedRow.type,
					value: formattedRow.value,
				}
			});

			return resolve(settings);
		});

	});

}


/**
 * Set one or more keys/values.
 *
 */
Settings.prototype.set = function(key, value, type) {

	var data = {};

	// Standardise the format
	//

	if (typeof(key) == 'string') {
		// One row: all params supplied
		data[key] = {
			value: value,
			type: type,
		}
	} else if (typeof(key) == 'object') {
		// Key is an object of { key: value } OR { key: { value: '', type: '' }}
		data = {...key};
	} else {
		throw "Settings: set(): type of key parameter must be string or object";
	}

	var rows = [],
		params = {},
		row = {},
		formattedRow;

	// Convert object of settings to rows that can be inserted
	//

	for (const key in data) {

		row = {
			key: key,
			type: (typeof(this.data[key]) !== 'undefined' ? this.data[key]['type'] : 'string'),
		};

		if (toString.call(data[key]) == "[object Object]" && data[key].hasOwnProperty('value')) {
			row.value = data[key]['value'];
			// Accept a 'type' if it's present
			if (data[key].hasOwnProperty('type')) {
				row.type = data[key]['type'];
			}
		} else {
			row.value = data[key];
		}

		formattedRow = this.sleepValue(row);

		params = {
			$key: formattedRow.key,
			$value: formattedRow.value,
			$type: formattedRow.type,
		};

		rows.push(params);
	}

	// Execute an sql statement for the rows of data
	//
	return new Promise((resolve, reject) => {

		var inserted = 0;
		var total = rows.length;
		var params = null;
		var db = database.getDb();
		const sql = "INSERT OR REPLACE INTO settings(`key`, `value`, `type`) VALUES ($key, $value, $type)";
		var stmt = db.prepare(sql);

		db.run("BEGIN TRANSACTION");

		rows.forEach((row) => {

			stmt.run(row, (err) => {

				inserted++;

				if (err) {
					console.error(err);
					return reject(err);
				}

				if (inserted >= total) {
					console.log("Finished saving settings!");
					db.run("COMMIT");
					stmt.finalize();
					this.reloadSettings().then(() => resolve());
				}

			});

		});

	});

}



/**
 * Format a DB setting row according to the `type` property.
 *
 */
Settings.prototype.wakeValue = function(row) {

	switch (row.type) {
		case 'integer':
			row.value = parseInt(row.value, 10);
		break;
		case 'boolean':
			switch (row.value) {
				case 1:
				case '1':
				case 'true':
					row.value = true;
				break;
				case 0:
				case '0':
				case 'false':
				default:
					row.value = false;
				break;
			}
		break;
		case 'json':
			row.value = JSON.parse(row.value);
		break;
	}

	return row;
}


Settings.prototype.sleepValue = function(row) {

	switch (row.type) {
		case 'json':
			row.value = JSON.stringify(row);
		break;
	}

	return row;
}


/**
 * Import settings from `settings-default.json` if the file exists.
 * On success, rename the file so it isn't imported again.
 *
 * This permits new managed instances to have controlled defaults.
 *
 */
Settings.prototype.importFromFile = function() {

	return new Promise((resolve, reject) => {

		const settingsFilePath = path.join(process.cwd(), "config", "settings-default.json");
		const settingsFileExists = fs.existsSync(settingsFilePath);

		if ( ! settingsFileExists) {
			console.log(`Default settings file not found (${settingsFilePath})`);
			resolve();
		}

		const settingsContents = fs.readFileSync(settingsFilePath, 'utf8');
		const defaultSettings = JSON.parse(settingsContents);

		console.log(`Loading default settings from ${settingsFilePath}...`);

		this.set(defaultSettings).then(() => {

			// Move defaults file
			const ts = (new Date()).getTime();
			const newFilePath = path.join(process.cwd(), "config", `settings-default.${ts}.json`);
			fs.rename(settingsFilePath, newFilePath, function (err) {
				console.log(`Moved default settings file to ${newFilePath}.`);
				return resolve();
			});

		});

	});

}

module.exports = (new Settings());
