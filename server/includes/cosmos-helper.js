/**
 * Living Lab server-side helper functions for CoSMoS
 *
 */

var slugify = require('slugify');

module.exports = {

	transformProject(dbRow) {

		if (dbRow.slug == undefined || dbRow.slug == null || (dbRow.slug && dbRow.slug.length === 0)) {
			dbRow.slug = slugify(dbRow.name && dbRow.name.length > 0 ? dbRow.name : '', {
				replacement: '-',
				lower: false,
				strict: true,
			});
		}

		if (typeof(dbRow.data) == 'undefined' || dbRow.data == null) {
			dbRow.data = {};
		} else {
			dbRow.data = JSON.parse(dbRow.data);
		}

		if (typeof(dbRow.config) == 'undefined' || dbRow.config == null) {
			dbRow.config = {};
		} else {
			dbRow.config = JSON.parse(dbRow.config);
		}

		if (!("models" in dbRow.config)) {
			// Set project to have all models enabled
			dbRow.config.models = [
				"analytic_model",
				"change_model",
				"intervention_theory_model",
				"moral_ordering_model",
				"co_creation_of_service_model",
			];
		}

		return dbRow;
	}

}
