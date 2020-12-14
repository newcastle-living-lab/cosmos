import { make } from 'vuex-pathify';
import md5 from 'md5';
import debounce from 'lodash/debounce';

import i18n from '@/plugins/i18n.js';

import Aspects from '@/aspects';
import Network from '@/services/Network';

export const state = {
	appName: 'CoSMoS',
	aspectEditId: false,
	isLoading: false,
	features: {
		userGuide: true,
	},
	authUser: null,
	config: {
		version: null,
		auto_save: false,
	},
	scale: false,
	showAnnotations: true,
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
	},
	userGuide: {
		isAvailable: false,
		isCompleted: false,
		isOpen: false,
		currentStep: 0,
		project: {},
	},
	logos: {
		primary: [],
		secondary: []
	}
};


export const getters = {

	hasUser(state) {
		return (state.authUser !== null && typeof state.authUser === 'object' && state.authUser.email ? true : false);
	},

	hasEditRole(state, getters) {
		return (getters.hasUser && state.authUser.roles.indexOf('edit') >= 0);
	},

	hasAdminRole(state, getters) {
		return (getters.hasUser && state.authUser.roles.indexOf('admin') >= 0);
	},

	userCanCreate(state, getters) {

		if ( ! getters.hasUser) {
			return false;
		}

		if (getters.hasEditRole || getters.hasAdminRole) {
			return true;
		}

		return false;
	},

	userCanEdit(state, getters) {

		var hasUser = getters.hasUser;
		var isOwner = (hasUser && state.authUser.username == state.project.created_by);
		var isAdmin = getters.hasAdminRole;
		var isEditor = getters.hasEditRole;

		if ( ! hasUser) {
			return false;
		}

		if (isAdmin) {
			return true;
		}

		if (isOwner && isEditor) {
			return true;
		}

		return false;
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

	INITIAL_SAVE_HASH(state) {
		state.lastSave.hash = md5(JSON.stringify(state.project));
	},

	START_LOADING(state) {
		state.isLoading = true;
	},

	STOP_LOADING(state) {
		state.isLoading = false;
	},

	EDIT_ASPECT(state, aspectId) {
		state.aspectEditId = aspectId;
	},

	STOP_EDITING_ASPECT(state) {
		state.aspectEditId = false;
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
	},

	OPEN_USER_GUIDE(state) {
		state.userGuide.currentStep = 0;
		state.userGuide.isOpen = true;
	},

	CLOSE_USER_GUIDE(state) {
		state.userGuide.currentStep = 0;
		state.userGuide.isOpen = false;
	},

	SET_USER_GUIDE_STATUS(state, { isAvailable, isCompleted }) {
		state.userGuide.isAvailable = isAvailable;
		state.userGuide.isCompleted = isCompleted;
	},

	INIT_USER_GUIDE_PROJECT(state) {
		var project = {
			data: {}
		};
		state.userGuide.project = Aspects.populateProject(project)
	}

};

export const actions = {

	fetchAuthUser({ state, commit }) {
		// commit('SET_AUTH_USER', null);
		return Network.getAuthUser().then(user => {
			commit('SET_AUTH_USER', user);
			return user;
		});
	},

	logout({ state, commit, dispatch }) {
		return Network.logoutUser().then(res => {
			commit('SET_AUTH_USER', null);
			dispatch('fetchAuthUser');
		});
	},

	/**
	 * Start user guide:
	 *
	 * - Set local values for step & open status
	 *
	 */
	openUserGuide({ state, commit }, { projectId, aspectId }) {
		const storageKey = `cosmos.ug.${projectId}.${aspectId}`;
		localStorage.removeItem(storageKey);
		commit('OPEN_USER_GUIDE');
	},

	/**
	 * On final step - close user guide.
	 *
	 * - Set localStorage flag for completion.
	 * - Set local values to hide the guide.
	 */
	finishUserGuide({ state, commit, dispatch }, { projectId, aspectId }) {
		const storageKey = `cosmos.ug.${projectId}.${aspectId}`;
		localStorage.setItem(storageKey, true);
		commit('CLOSE_USER_GUIDE');
		dispatch('checkUserGuideStatus', projectId, aspectId);
	},

	/**
	 * Remove the flag that this user guide has ran.
	 * - Remove flag from localStorage
	 *
	 */
	removeUserGuide({ state, commit }, { projectId, aspectId }) {
		const storageKey = `cosmos.ug.${projectId}.${aspectId}`;
		localStorage.removeItem(storageKey);
		dispatch('checkUserGuideStatus', projectId, aspectId);
	},

	/**
	 * Given a project + aspect, check & update the user guide status.
	 *
	 */
	checkUserGuideStatus({ state, commit, dispatch }, { projectId, aspectId }) {

		if ( ! projectId || ! aspectId) {
			return;
		}

		// Close it if one is already open
		commit('CLOSE_USER_GUIDE');

		// Get stored value
		const storageKey = `cosmos.ug.${projectId}.${aspectId}`;
		var value = localStorage.getItem(storageKey);
		var isCompleted = (value === true || value === 'true');
		var aspect = Aspects.get(aspectId);
		var hasUg = (aspect && typeof(aspect.Guide) !== 'undefined');

		// Set the new status
		commit('SET_USER_GUIDE_STATUS', { isAvailable: hasUg, isCompleted: isCompleted });

		// Open the user guide if it's available and hasn't been completed yet.
		if (hasUg && ! isCompleted) {
			dispatch('openUserGuide', { projectId: projectId, aspectId: aspectId });
		}
	},

	fetchProjects({ state, commit }) {
		commit('START_LOADING');
		Network.getProjects()
			.then(projects => { commit('SET_PROJECTS', projects) })
			.then(() => commit('STOP_EDITING_ASPECT'))
			.then(() => commit('CLEAR_LAST_SAVE'))
			.then(() => commit('STOP_LOADING'));
	},

	fetchProject({ state, commit }, id) {
		commit('SET_PROJECT', {});
		commit('SET_SCALE', false);
		commit('START_LOADING');
		Network.getProject(id)
			.then(project => { commit('SET_PROJECT', project) })
			.then(() => commit('STOP_EDITING_ASPECT'))
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

		const isEditing = (state.aspectEditId !== false);
		const hasProject = (state.project && state.project.id ? true : false);
		const hasLastSave = (state.lastSave.hash !== null);

		if ( ! hasProject || ! hasLastSave) {
			commit('AUTO_SAVE_WAIT', false);
			return;
		}

		const newHash = md5(JSON.stringify(state.project));
		const isDiff = (newHash !== state.lastSave.hash);

		if ( ! isDiff) {
			commit('AUTO_SAVE_WAIT', false);
			return;
		}

		commit('AUTO_SAVE_WAIT', true);

		dispatch('doAutoSaveAction');
	},

	doAutoSaveAction: debounce(function({ state, dispatch }) {
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
						commit('SET_TOAST', { message: i18n.t('app.project_save_success'), type: 'success', seconds: 2 });
					}
				} else {
					const msg = i18n.t('app.error_message', { message: res.reason });
					commit('SET_TOAST', { message: msg, type: 'error', seconds: 10 });
				}
				return res.success;
			})
		.then(() => commit('STOP_LOADING'));
	},

	fetchLogos({ state, commit }) {
		return Network.getLogos().then(res => {
			if (res.success && res.logos) {
				commit('SET_LOGOS', res.logos);
			}
			return res;
		});
	}

}
