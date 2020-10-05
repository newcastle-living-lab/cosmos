<template>

	<main ref="container" class="app-content light living-lab-models">
		<div class="scrollable scr-y">
			<div class="container grid-x">
				<h4 class="mb-8 mt-4">{{ $t('aspects.documents.dashboard.title') }}</h4>

				<div class="columns external-items" v-if="documents">
					<ExternalItem
						v-for="(item, index) in documents"
						:key="index"
						:item="item"
						:projectId="project.id"
						type="livlabmod"
					/>
				</div>

				<div class="empty" v-if="!documents.length">
					<p class="empty-title h5">{{ $t('aspects.documents.dashboard.empty_set') }}</p>
					<div class="empty-action">
						<button class="btn btn-primary" v-show="userCanEdit" @click.prevent="doEdit">{{ $t('aspects.documents.dashboard.manage') }}</button>
					</div>
				</div>
			</div>
		</div>
	</main>

</template>

<script>


import { get, commit } from 'vuex-pathify';

import ExternalItem from '@/components/project/view/ExternalItem';

export default {

	name: "DocumentsView",

	components: {
		ExternalItem
	},

	props: {
		aspectId: [Boolean, String],
	},

	computed: {

		...get([
			'project',
			'userCanEdit',
		]),

		dataPath() {
			return `project@data.${this.aspectId}`;
		},

		aspectData: get(':dataPath'),

		documents() {
			if ( ! this.aspectData) {
				return [];
			}
			return this.aspectData.data.items;//project.data.livingLabModels.items;
		}

	},

	methods: {
		doEdit() {
			commit('EDIT_ASPECT', this.aspectId);
		},
	}

}

</script>
