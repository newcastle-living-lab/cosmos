import Vue from 'vue';
import Vuex from 'vuex';
import pathify from './pathify';

import { state, getters, actions, mutations } from './base';

Vue.use(Vuex)

function builder(params) {

	const populatedState = {...state, ...params};
	console.debug(populatedState);

	return new Vuex.Store({
		plugins: [ pathify.plugin ],
		state: populatedState,
		getters,
		actions,
		mutations,
	});

}

export default builder;
