<template>

	<main ref="container" class="app-content light moral-summary" v-if="aspectData">
		<div class="scrollable scr-y">
			<div class="container grid-xl">
				<h1 class="h4 mb-8 mt-4" v-if="aspectData.model">{{ aspectData.model.title }}</h1>

				<div class="divider"></div>

				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">{{ $t('aspects.user_journey_model.definitions.discovering.title') }}</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.discovering.discovery_medium.label') }}</td>
									<td class="group-value">{{ $t(`aspects.user_journey_model.options.mediums.${aspectData.discovering.discovery_medium}`) }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.discovering.information_medium.label') }}</td>
									<td class="group-value">{{ $t(`aspects.user_journey_model.options.mediums.${aspectData.discovering.information_medium}`) }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.discovering.information_experience.label') }}</td>
									<td class="group-value like-pre"><img class="img-responsive img-experience" v-if="aspectData.discovering.information_experience" :src="experienceImage(aspectData.discovering.information_experience)" /></td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.discovering.comments.label') }}</td>
									<td class="group-value like-pre"><span v-linkify="aspectData.discovering.comments" /></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>


				<div class="divider"></div>


				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">{{ $t('aspects.user_journey_model.definitions.accessing.title') }}</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.accessing.access_method.label') }}</td>
									<td class="group-value">{{ $t(`aspects.user_journey_model.options.access_methods.${aspectData.accessing.access_method}`) }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.accessing.qualification_process.label') }}</td>
									<td class="group-value like-pre"><span v-linkify="aspectData.accessing.qualification_process" /></td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.accessing.qualification_experience.label') }}</td>
									<td class="group-value like-pre"><img class="img-responsive img-experience" v-if="aspectData.accessing.qualification_experience" :src="experienceImage(aspectData.accessing.qualification_experience)" /></td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.accessing.appropriate_comment.label') }}</td>
									<td class="group-value like-pre"><span v-linkify="aspectData.accessing.appropriate_comment" /></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>


				<div class="divider"></div>


				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">{{ $t('aspects.user_journey_model.definitions.using.title') }}</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.using.participate_experience.label') }}</td>
									<td class="group-value like-pre"><img class="img-responsive img-experience" v-if="aspectData.using.participate_experience" :src="experienceImage(aspectData.using.participate_experience)" /></td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.using.accessible_experience.label') }}</td>
									<td class="group-value like-pre"><img class="img-responsive img-experience" v-if="aspectData.using.accessible_experience" :src="experienceImage(aspectData.using.accessible_experience)" /></td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.using.time_experience.label') }}</td>
									<td class="group-value like-pre"><img class="img-responsive img-experience" v-if="aspectData.using.time_experience" :src="experienceImage(aspectData.using.time_experience)" /></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>


				<div class="divider"></div>


				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">{{ $t('aspects.user_journey_model.definitions.evaluating.title') }}</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.evaluating.opinions_asked.label') }}</td>
									<td class="group-value">{{ $t(`aspects.user_journey_model.options.yes_no_maybe.${aspectData.evaluating.opinions_asked}`) }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.evaluating.opinions_how.label') }}</td>
									<td class="group-value">{{ $t(`aspects.user_journey_model.options.opinions_how.${aspectData.evaluating.opinions_how}`) }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.evaluating.service_experience.label') }}</td>
									<td class="group-value like-pre"><img class="img-responsive img-experience" v-if="aspectData.evaluating.service_experience" :src="experienceImage(aspectData.evaluating.service_experience)" /></td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.evaluating.surprises_comments.label') }}</td>
									<td class="group-value like-pre"><span v-linkify="aspectData.evaluating.surprises_comments" /></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>


				<div class="divider"></div>


				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">{{ $t('aspects.user_journey_model.definitions.instigating.title') }}</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.instigating.design_role.label') }}</td>
									<td class="group-value like-pre"><span v-linkify="aspectData.instigating.design_role" /></td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.instigating.instigate_role.label') }}</td>
									<td class="group-value">
										<ul>
											<li
												v-for="roleName in aspectData.instigating.instigate_role"
											>
												{{ $t(`aspects.user_journey_model.options.instigate_roles.${roleName}`) }}
											</li>
										</ul>
									</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.user_journey_model.definitions.instigating.comments.label') }}</td>
									<td class="group-value like-pre"><span v-linkify="aspectData.instigating.comments" /></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

			</div>
		</div>
	</main>

</template>

<script>

import { linkify } from '@/plugins/linkify';
import { get, set, sync, call } from 'vuex-pathify';
import find from 'lodash/find';

import Aspects from '@/aspects';

const FACE_TYPES = {
	'negative': 'user-journey/face-frown.svg',
	'neutral': 'user-journey/face-neutral.svg',
	'positive': 'user-journey/face-smile.svg',
};

export default {

	name: "UserJourneySummaryView",

	props: {
		aspectId: [Boolean, String],
	},

	directives: {
		linkify
	},

	computed: {

		...get([
			'project',
		]),

		/**
		 * Get aspect (ALL data - CONFIG + DEFS etc!) based on supplied editor ID
		 *
		 */
		aspect() {
			const aspect = this.aspectId;
			if ( ! this.aspectId) {
				return null;
			}
			return Aspects.get(aspect);
		},


		dataPath() {
			return `project@data.${this.aspectId}`;
		},

		aspectData: get(':dataPath'),

		definitionsById() {

			var defs = {};
			var children = {};

			this.aspect.DEFINITIONS.forEach(item => {
				if (item.children && Array.isArray(item.children)) {
					children = {};
					item.children.forEach(child => {
						children[child.id] = child;
					});
					item.children = children;
				}

				defs[item.id] = item;
			});

			return defs;
		},

	},

	methods: {
		experienceImage(value) {
			return FACE_TYPES[value] ? '/images/aspects/' + FACE_TYPES[value] : null;
		}
	}

}

</script>

<style lang="scss" scoped>
.group-title {
	font-size: 1.3rem;
	// line-height: 1;
	padding-top: .6rem;
}

.group-prompt {
	font-size: .8rem;
	font-weight: bold;
	width: 50%;
	vertical-align: top;
}

.group-value {
	vertical-align: top;

	.link,
	a.link {
		color: #0074D9;
		text-decoration: underline;
	}
}

.like-pre {
	white-space: pre;
}

table {
	margin-bottom: 2.4rem;
}

.divider {
	border-top-width: .1rem;
	height: .1rem;
}

.img-experience {
	max-width: 48px;
}
</style>
