<template>

	<section class="app-header">

		<nav class="navbar">

			<section class="navbar-section navbar-buttons">

				<router-link to='/' class='navbar-brand btn btn-link'>{{ appName }}</router-link>

			</section>

			<section class="navbar-section navbar-tabs">
				<div class="input-group input-inline mr-4">
					<a v-if="hasUser"
						class="btn btn-link btn-sm"
						:href="accountUrl"
					><user-icon size="16" /> {{ authUser.email }}</a>
					<a v-if="!hasUser"
						class="btn btn-link btn-sm"
						:href="loginUrl"
					><key-icon size="16" /> {{ $t('app.log_in') }}</a>
				</div>

				<LanguageSwitcher />

				<div class="input-group input-inline ml-4">
					<a :href="userGuideUrl"
						target="_blank"
						class="btn btn-guide btn-sm"
					><help-icon size="16" /> {{ appName }} {{ $t('app.user_guide') }}</a>
				</div>

			</section>

		</nav>

	</section>

</template>

<script>

import { get, sync, commit, dispatch } from 'vuex-pathify';

import UserIcon from 'vue-feather-icons/icons/UserIcon';
import KeyIcon from 'vue-feather-icons/icons/KeyIcon';
import HelpIcon from 'vue-feather-icons/icons/HelpCircleIcon';

import Network from '@/services/Network';

import LanguageSwitcher from "./LanguageSwitcher.vue";

export default {

	components: {
		UserIcon,
		KeyIcon,
		HelpIcon,
		LanguageSwitcher,
	},

	props: ['route'],

	computed: {

		...get([
		    'userGuideUrl',
			'appName',
			'userCanEdit',
			'hasUser',
			'authUser',
		]),

		accountUrl() {
			return '/admin/account';
		},

		loginUrl() {
			let currentRoute = this.route.path;
			let path = top.location.pathname.replace(currentRoute, '');
			let uri = path + currentRoute;
			uri = uri.replace('//', '/');
			return '/admin/account/login?ref=' + encodeURIComponent(uri);
		},

	},

	methods: {

	},

	mounted() {
		// this.setUserGuideData();
	}

}
</script>
