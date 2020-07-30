import { make } from 'vuex-pathify';
import md5 from 'md5';
import debounce from 'lodash/debounce';

import Network from '@/services/Network';

export const state = {
	appName: 'CoSMoS',
	isEditing: false,
	isLoading: false,
	config: {
		user: null,
		require_auth: true,
		version: null,
		auto_save: false,
	},
	scale: false,
	stageHover: false,
	projects: [],
	project: {},
	toast: {
		active: false,
		message: null,
		type: null,
		seconds: null
	},
	lastSave: {
		time: null,
		hash: null,
	},
	options: {
		fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
	}
};


export const getters = {

	requireAuth(state) {
		return (state.config.require_auth === true);
	},

	hasUser(state) {
		return state.config.user !== null && typeof state.config.user === 'object' && state.config.user.username;
	},

	hasEditRole(state, getters) {
		return (getters.hasUser && getters.user.roles.indexOf('edit') >= 0);
	},

	user(state) {
		return state.config.user;
	},

	userCanEdit(state, getters) {

		if ( ! getters.requireAuth) {
			return true;
		}

		return getters.hasUser && getters.hasEditRole;
	}

};


export const mutations = {

	// creates SET_* functions
	...make.mutations(state),

	TOUCH_MODIFIED_DATE(state) {
		state.project.modified_at = (new Date()).toLocaleDateString();
	},

	TOUCH_LAST_SAVE(state) {
		state.lastSave = {
			waiting: false,
			time: new Date(),
			hash: md5(JSON.stringify(state.project)),
		}
	},

	AUTO_SAVE_WAIT(state, val) {
		state.lastSave.waiting = val;
	},

	CLEAR_LAST_SAVE(state) {
		state.lastSave = {
			waiting: false,
			time: null,
			hash: null
		};
	},

	INITIAL_SAVE_HASH(sate) {
		state.lastSave.hash = md5(JSON.stringify(state.project));
	},

	START_LOADING(state) {
		state.isLoading = true;
	},

	STOP_LOADING(state) {
		state.isLoading = false;
	},

	START_EDITING(state) {
		state.isEditing = true;
	},

	STOP_EDITING(state) {
		state.isEditing = false;
	},

	SET_TOAST(state, { type, message, seconds }) {
		state.toast.active = true;
		state.toast.type = type;
		state.toast.message = message;
		state.toast.seconds = seconds;
	},

	CLEAR_TOAST(state) {
		state.toast.active = false;
		state.toast.type = null;
		state.toast.message = null;
		state.toast.seconds = null;
	},

	START_STAGE_HOVER(state) {
		state.stageHover = true;
	},

	STOP_STAGE_HOVER(state) {
		state.stageHover = false;
	}

};

export const actions = {

	fetchProjects({ state, commit }) {
		commit('START_LOADING');
		Network.getProjects()
			.then(projects => { commit('SET_PROJECTS', projects) })
			.then(() => commit('CLEAR_LAST_SAVE'))
			.then(() => commit('STOP_LOADING'));
	},

	fetchProject({ state, commit }, id) {
		commit('SET_PROJECT', {});
		commit('SET_SCALE', false);
		commit('START_LOADING');
		Network.getProject(id)
			.then(project => { commit('SET_PROJECT', project) })
			.then(() => commit('CLEAR_LAST_SAVE'))
			.then(() => commit('INITIAL_SAVE_HASH'))
			.then(() => commit('STOP_LOADING'));
	},

	clearProject({ state, commit }) {
		commit('SET_PROJECT', {});
		commit('SET_SCALE', false);
		commit('CLEAR_LAST_SAVE');
	},

	doAutoSave({ state, commit, dispatch }) {

		var isEditing = state.isEditing;
		var hasProject = (state.project && state.project.id);
		var hasLastSave = (state.lastSave.hash);

		if ( ! isEditing || ! hasProject || ! hasLastSave) {
			commit('AUTO_SAVE_WAIT', false);
			return;
		}

		var newHash = md5(JSON.stringify(state.project));
		var isDiff = (newHash !== state.lastSave.hash);

		if ( ! isDiff) {
			commit('AUTO_SAVE_WAIT', false);
			return;
		}

		commit('AUTO_SAVE_WAIT', true);

		dispatch('doAutoSaveAction');
	},

	doAutoSaveAction: debounce(function({ dispatch }) {
		if (state.project && state.project.id) {
			dispatch('saveProject');
		}
	}, 1000, { maxWait: 3000 }),

	saveProject({ state, commit }, source) {

		commit('START_LOADING');
		commit('TOUCH_MODIFIED_DATE');

		Network.saveProject(state.project.id, state.project)
			.then(res => {
				if (res && res.success) {
					commit('TOUCH_LAST_SAVE');
					if (source === 'manual') {
						commit('SET_TOAST', { message: 'Project saved!', type: 'success', seconds: 2 });
					}
				} else {
					commit('SET_TOAST', { message: 'Error saving project: ' + res.reason, type: 'error', seconds: 10 });
				}
				return res.success;
			})
		.then(() => commit('STOP_LOADING'));
	}

}
