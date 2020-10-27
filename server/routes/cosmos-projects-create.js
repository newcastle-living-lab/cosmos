var database = require("../includes/database.js"),
	eventLog = require("../includes/event-log"),
	eventType = require("../includes/event-types");

exports.method = "post";
exports.route = "/cosmos-api/projects";

exports.handler = function(req, res, next) {

	const authUserEmail = req.user.email;

	const created_at = new Date().toISOString()
		.replace(/T/, ' ')
		.replace(/\..+/, '');

	var decodedBody = req.body;

	var params = {
		$name: decodedBody.name,
		$created_at: created_at,
		$modified_at: null,
		$created_by: authUserEmail,
		$data: JSON.stringify({}),
		$config: JSON.stringify(decodedBody.config),
	};

	var sql = "INSERT INTO `cosmos` (name, created_at, modified_at, created_by, data, config) VALUES ($name, $created_at, $modified_at, $created_by, $data, $config)";
	var db = database.getDb();
	var stmt = db.prepare(sql);

	stmt.run(params, (err) => {

		if (err) {
			return res.status(500).send({
				'success': false,
				'reason': error,
			});
		}

		res.send({
			'success': true,
			'id': parseInt(stmt.lastID.toString(), 10),
		});

	});

};
