<template>

	<div class="sidebar-content py-12">

		<div class="text-error mb-8">
			<alert-icon size="72" />
		</div>

		<h5>{{ $t('app.delete_project') }}</h5>
		<p>{{ $t('app.delete_project_warning') }}</p>

		<div class="mt-12">
			<button class="btn btn-negative btn-block" @click="doDelete">{{ $t('app.delete_button') }}</button>
		</div>
	</div>

</template>

<script>

import { commit } from 'vuex-pathify';

import AlertIcon from 'vue-feather-icons/icons/AlertTriangleIcon';

import Network from '@/services/Network';


export default {

	components: {
		AlertIcon,
	},

	name: "ProjectDangerEditor",

	props: ['value'],

	methods: {
		doDelete() {

			if ( ! confirm(this.$t('app.are_you_sure'))) {
				return;
			}

			Network.deleteProject(this.value.id)
				.then((res) => {
					if (res && res.success) {
						commit('SET_TOAST', { message: this.$t('app.project_deleted'), type: 'success' });
						this.$router.push('/');
						return;
					}
					const msg = this.$t('app.error_message', { message: res.reason });
					commit('SET_TOAST', { message: msg, type: 'error' });
				})
				.catch((err) => {
					const msg = this.$t('app.error_message', { message: err });
					commit('SET_TOAST', { message: msg, type: 'error' });
				});
		}
	}

}
</script>
