var fs = require("fs"),
	path = require("path"),
	sqlite3 = require("sqlite3").verbose(),
	_ = require('lodash');

var Database = function() {
	this.dbPath = null;
	this.dbExists = null;
	this.db = null;
}


Database.prototype.init = function() {
	this.dbPath = null;
	this.dbExists = fs.existsSync(this.getPath());
	this.db = new sqlite3.Database(this.getPath());
	this.db.serialize();
	this.createTables();
	this.updateTables();
	this.db.parallelize();
}


Database.prototype.getPath = function() {
	if (this.dbPath == null) {
		var config = require(path.join(process.cwd(), "config", "config.json"));
		this.dbPath = path.join(process.cwd(), config.db_path);
		console.log("Database path: " + this.dbPath);
	}
	return this.dbPath;
}


Database.prototype.getDb = function() {
	return this.db;
}


Database.prototype.createTables = function() {

	this.db.run("CREATE TABLE IF NOT EXISTS `events` (id INTEGER PRIMARY KEY, datetime TEXT, user TEXT, type TEXT, ip TEXT, browser TEXT, data TEXT)", function(err) {
		if (err) {
			console.error("Database events creation error");
		}
	});

	this.db.run("CREATE TABLE IF NOT EXISTS `cosmos` (id INTEGER PRIMARY KEY, name TEXT, slug TEXT, folder TEXT, template TEXT, created_at TEXT, modified_at TEXT, created_by TEXT, data TEXT)", function(err) {
		if (err) {
			console.error("Database cosmos creation error");
		}
	});

	this.db.run("CREATE TABLE IF NOT EXISTS `users` (id INTEGER PRIMARY KEY, status INTEGER, email TEXT, password TEXT, name TEXT, roles TEXT, created_at TEXT, modified_at TEXT, UNIQUE(email))", function(err) {
		if (err) {
			console.error("Database users creation error");
		}
	});

	this.db.run("CREATE TABLE IF NOT EXISTS `settings` (`key` TEXT PRIMARY KEY, `value` TEXT, `type` TEXT)", function(err) {
		if (err) {
			console.error("Database settings creation error");
		}
	});

}


Database.prototype.updateTables = function() {

	var db = this.db;

	// Add config column
	this.tableHasColumn('cosmos', 'config', function(colExists) {
		if ( ! colExists) {
			db.run('ALTER TABLE cosmos ADD COLUMN config TEXT');
			console.log('Added "config" column to Cosmos.');
		}
	});

	// No current updates to do

}


Database.prototype.tableHasColumn = function(table, column, cb) {

	var sql = 'PRAGMA table_info(' + table + ')';

	this.db.all(sql, function (error, rows) {
		var result = _.some(rows, {'name': column});
		cb(result);
	});

}


Database.prototype.closeDb = function() {
	if (this.db !== null && this.db.open) {
		this.db.close();
		console.log("Database closed.");
	} else {
		console.log("Database was not open");
	}
}


module.exports = (new Database());
