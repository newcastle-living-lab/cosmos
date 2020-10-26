<template>

	<div class="card card-min card-new-project">
		<div class="card-header">
			<div class="card-title">{{ $t('app.new_project') }}</div>
		</div>
		<template v-if="userCanCreate">
			<div class="card-body">
				<div class="card-content">

					<VGroup name="name" :label="$t('app.name')">
						<VInput type="text" id="name" v-model="newProject.name" />
					</VGroup>

					<VGroup name="models" :label="$t('app.models')">
						<VCheckList :options="availableModels" v-model="newProject.config.models" />
					</VGroup>
				</VGroup>
				</div>
			</div>
			<div class="card-footer">
				<VButton
					class="btn-primary"
					@click="createProject"
					:disabled="(canCreateNewProject ? false : true)"
					:class="(canCreateNewProject ? '' : 'disabled')"
				>{{ $t('app.create') }}</VButton>
			</div>
		</template>
		<template v-else>
			<div class="card-body">
				<div class="tile tile-empty">
					<div class="tile-content">
						<div><alert-circle-icon size="16" /></div>
						<div v-if="authUser">{{ $t('app.user_is_read_only') }}</div>
						<div v-else><a :href="loginUrl">{{ $t('app.log_in') }}</a> {{ $t('app.to_create_project') }}</div>
					</div>
				</div>
			</div>
		</template>
	</div>

</template>

<script>

import { get } from 'vuex-pathify';

import AlertCircleIcon from 'vue-feather-icons/icons/AlertCircleIcon';

import Network from '@/services/Network';

export default {

	components: {
		AlertCircleIcon,
	},

	props: {
		loginUrl: String,
	},

	data() {
		return {
			newProject: {
				name: null,
				created_at: null,
				config: {
					models: [
						"analytic_model",
						"change_model",
						"intervention_theory_model",
						"moral_ordering_model",
						"co_creation_of_service_model",
					],
				},
			},
		};
	},

	computed: {

		...get([
			'authUser',
			'userCanCreate',
		]),

		canCreateNewProject() {
			return (this.newProject.name && this.newProject.name.length > 0)
		},

		availableModels() {
			return [
				{ value: "analytic_model", label: this.$t(`aspects.analytic_model.title`) },
				{ value: "change_model", label: this.$t(`aspects.change_model.title`) },
				{ value: "intervention_theory_model", label: this.$t(`aspects.intervention_theory_model.title`) },
				{ value: "moral_ordering_model", label: this.$t(`aspects.moral_ordering_model.title`) },
				{ value: "co_creation_of_service_model", label: this.$t(`aspects.co_creation_of_service_model.title`) },
			];
		}
	},

	methods: {

		reset() {
			this.newProject = {
				name: null,
				created_at: null,
				config: {
					models: [
						"analytic_model",
						"change_model",
						"intervention_theory_model",
						"moral_ordering_model",
						"co_creation_of_service_model",
					],
				},
			};
		},

		createProject() {
			this.newProject.created_at = (new Date()).toLocaleDateString();
			Network.createProject(this.newProject)
				.then(id => { this.$router.push('/' + id + '/dashboard'); })
				.then(() => this.reset());
		},

	},

	mounted() {
		this.reset();
	}

};
</script>

