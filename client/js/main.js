import 'es6-promise/auto';

import Vue from 'vue';
Vue.config.productionTip = false;

import VueKonva from 'vue-konva';
Vue.use(VueKonva);

import UI from "./components/ui";
Vue.use(UI);

import Cosmos from "./components/cosmos";
Vue.use(Cosmos);

import Editors from "./components/project/edit";
Vue.use(Editors);

import Aspects from "./aspects";
Vue.use(Aspects.Components);

import i18n from './plugins/i18n';
import router from './plugins/router';
import store from './store';
import App from './App';

import Network from './services/Network';


/**
 * Return the value in a type that is inferred from the content.
 * Used in parsing the data-* attributes on the mount element.
 *
 */
const formatVal = function(value) {

	var falseValues = ['false', 0, undefined, '0', 'no', 'off', 'null', null];
	var trueValues = ['true', 1, '1', 'yes', 'on'];

	if (falseValues.indexOf(value) !== -1) {
		return false;
	}

	if (trueValues.indexOf(value) !== -1) {
		return true;
	}

	if (isNaN(+value)) {
		return value;
	}

	return +value;
}


/**
 * Get all the data-* attributes on the mount element.
 *
 */
const getParams = function(elt) {
	const el = document.getElementById(elt);
	var data = {};
	for (var key in el.dataset) {
		data[key] = formatVal(el.dataset[key]);
	}
	return data;
}


Network.getAuthUser().then((user) => {

	new Vue({
		i18n,
		router,
		store: store({
			authUser: user,
			config: getParams('cosmos'),
		}),
		render: h => h(App),
	}).$mount('#cosmos');

});
