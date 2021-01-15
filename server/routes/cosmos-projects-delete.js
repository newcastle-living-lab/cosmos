var path = require("path"),
	fs = require("fs"),
	rimraf = require("rimraf"),
	database = require("../includes/database.js"),
	eventLog = require("../includes/event-log"),
	auth = require("../includes/auth.js"),
	eventType = require("../includes/event-types");

exports.method = "delete";
exports.route = "/cosmos-api/projects/:projectId";

var handlers = [];

// Get project - need to interrogate it for the 'created_by' user
//
handlers.push(function(req, res, next) {

	var projectId = req.params.projectId;

	req.projectId = null;
	req.projectUser = null;

	var db = database.getDb();
	var sql = "SELECT id, created_by FROM cosmos WHERE id = ?";

	db.get(sql, [projectId], function(err, row) {

		if ( ! err && row) {
			req.projectId = row.id;
			req.projectUser = row.created_by;
			return next();
		}

		if ( ! row) {
			return res.status(404).send({
				'success': false,
				'reason': 'Not found',
			});
		}

		return res.status(500).send({
			'success': false,
			'reason': 'Unknown',
		});

	});
});


// Check permission of user
//
handlers.push(function(req, res, next) {

	var projectUser = req.projectUser;
	var hasRoles = (req.user && req.user.roles && req.user.roles.length > 0);
	var hasMatchingRole = (hasRoles && req.user.roles.indexOf("admin") !== -1);

	if (projectUser === req.user.email || hasMatchingRole) {
		return next();
	}

	return res.status(403).send({
		'success': false,
		'reason': 'Access denied',
		'userIsOwner': (projectUser == req.user.email),
		'userIsAdmin': hasMatchingRole,
	});

});


// Delete project
//
handlers.push(function(req, res, next) {

	var projectId = req.projectId;

	if ( ! projectId) {
		return res.status(500).send({
			'success': false,
			'reason': 'No ID',
		});
	}

	var params = {
		$id: projectId,
	};

	var db = database.getDb();
	var sql = "DELETE FROM `cosmos` WHERE id = $id";

	db.run(sql, params, function(error) {

		if (error) {
			return res.status(500).send({
				'success': false,
				'reason': error,
			});
		}

		// Remove dirs
		try {
			const baseDir = fs.realpathSync(path.join(process.cwd(), 'data', 'uploads'));
			const projectUploadDir = fs.realpathSync(path.join(baseDir, '' + projectId));
			rimraf(projectUploadDir, (err) => {
				if (err) {
					console.error(err);
				}
			});
		} catch (e) {
			console.error("Cannot remove project dir: " + e.message);
		}

		return res.send({
			'success': true,
		});

	});

});


exports.handler = handlers;
