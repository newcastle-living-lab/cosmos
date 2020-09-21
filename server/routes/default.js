exports.method = "get";
exports.route = "/";

exports.handler = function(req, res) {
	return res.redirect('/cosmos/');
};
