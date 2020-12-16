<template>

	<main ref="container" class="app-content light summary-view" v-if="aspectData">
		<div class="scrollable scr-y">
			<div class="container grid-xl">
				<h1 class="h4 mb-8 mt-4" v-if="aspectData.model">{{ aspectData.model.title }}</h1>


				<!-- Discovering -->

				<SummaryBlock :title="$t('aspects.user_journey_model.definitions.discovering.title')">

					<SummaryRow
						labelKey="aspects.user_journey_model.definitions.discovering.discovery_medium.label"
						:valueKey="`aspects.user_journey_model.options.mediums.${aspectData.discovering.discovery_medium}`"
						:response="aspectData.discovering.discovery_medium"
					/>

					<SummaryRow
						labelKey="aspects.user_journey_model.definitions.discovering.information_medium.label"
						:valueKey="`aspects.user_journey_model.options.mediums.${aspectData.discovering.information_medium}`"
						:response="aspectData.discovering.information_medium"
					/>

					<SummaryRow labelKey="aspects.user_journey_model.definitions.discovering.information_experience.label">
						<img
							class="img-responsive img-experience"
							v-if="aspectData.discovering.information_experience"
							:src="experienceImage(aspectData.discovering.information_experience)"
						/>
					</SummaryRow>

					<SummaryRow
						labelKey="aspects.user_journey_model.definitions.discovering.comments.label"
						:response="aspectData.discovering.comments"
						:linkify="true"
					/>

				</SummaryBlock>



				<!-- Accessing -->

				<SummaryBlock :title="$t('aspects.user_journey_model.definitions.accessing.title')">

					<SummaryRow
						labelKey="aspects.user_journey_model.definitions.accessing.access_method.label"
						:valueKey="`aspects.user_journey_model.options.access_methods.${aspectData.accessing.access_method}`"
						:response="aspectData.accessing.access_method"
					/>

					<SummaryRow
						labelKey="aspects.user_journey_model.definitions.accessing.qualification_process.label"
						:response="aspectData.accessing.qualification_process"
						:linkify="true"
					/>

					<SummaryRow labelKey="aspects.user_journey_model.definitions.accessing.qualification_experience.label">
						<img
							class="img-responsive img-experience"
							v-if="aspectData.accessing.qualification_experience"
							:src="experienceImage(aspectData.accessing.qualification_experience)"
						/>
					</SummaryRow>

					<SummaryRow
						labelKey="aspects.user_journey_model.definitions.accessing.appropriate_comment.label"
						:response="aspectData.accessing.appropriate_comment"
						:linkify="true"
					/>

				</SummaryBlock>



				<!-- Using -->

				<SummaryBlock :title="$t('aspects.user_journey_model.definitions.using.title')">

					<SummaryRow labelKey="aspects.user_journey_model.definitions.using.participate_experience.label">
						<img
							class="img-responsive img-experience"
							v-if="aspectData.using.participate_experience"
							:src="experienceImage(aspectData.using.participate_experience)"
						/>
					</SummaryRow>

					<SummaryRow labelKey="aspects.user_journey_model.definitions.using.accessible_experience.label">
						<img
							class="img-responsive img-experience"
							v-if="aspectData.using.accessible_experience"
							:src="experienceImage(aspectData.using.accessible_experience)"
						/>
					</SummaryRow>

					<SummaryRow labelKey="aspects.user_journey_model.definitions.using.time_experience.label">
						<img
							class="img-responsive img-experience"
							v-if="aspectData.using.time_experience"
							:src="experienceImage(aspectData.using.time_experience)"
						/>
					</SummaryRow>

					<SummaryRow
						labelKey="aspects.user_journey_model.definitions.using.where.label"
						:valueKey="`aspects.user_journey_model.options.where.${aspectData.using.where}`"
						:response="aspectData.using.where"
					/>

				</SummaryBlock>



				<!-- Evaluating -->

				<SummaryBlock :title="$t('aspects.user_journey_model.definitions.evaluating.title')">

					<SummaryRow
						labelKey="aspects.user_journey_model.definitions.evaluating.opinions_asked.label"
						:valueKey="`aspects.user_journey_model.options.yes_no_maybe.${aspectData.evaluating.opinions_asked}`"
						:response="aspectData.evaluating.opinions_asked"
					/>

					<SummaryRow
						labelKey="aspects.user_journey_model.definitions.evaluating.opinions_how.label"
						:valueKey="`aspects.user_journey_model.options.opinions_how.${aspectData.evaluating.opinions_how}`"
						:response="aspectData.evaluating.opinions_how"
					/>

					<SummaryRow
						labelKey="aspects.user_journey_model.definitions.evaluating.service_experience.label"
					>
						<img
							class="img-responsive img-experience"
							v-if="aspectData.evaluating.service_experience"
							:src="experienceImage(aspectData.evaluating.service_experience)"
						/>
					</SummaryRow>

					<SummaryRow
						labelKey="aspects.user_journey_model.definitions.evaluating.surprises_comments.label"
						:response="aspectData.evaluating.surprises_comments"
						:linkify="true"
					/>

				</SummaryBlock>



				<!-- Designing -->

				<SummaryBlock :title="$t('aspects.user_journey_model.definitions.designing.title')">

					<SummaryRow
						:response="aspectData.designing.design_input_asked"
						labelKey="aspects.user_journey_model.definitions.designing.design_input_asked.label"
						:valueKey="`aspects.user_journey_model.options.yes_no_maybe.${aspectData.designing.design_input_asked}`"
					/>

					<SummaryRow
						:response="aspectData.designing.design_input_method"
						labelKey="aspects.user_journey_model.definitions.designing.design_input_method.label"
						:valueKey="`aspects.user_journey_model.options.methods.${aspectData.designing.design_input_method}`"
					/>

					<SummaryRow
						labelKey="aspects.user_journey_model.definitions.designing.design_input_experience.label"
					>
						<img
							class="img-responsive img-experience"
							v-if="aspectData.designing.design_input_experience"
							:src="experienceImage(aspectData.designing.design_input_experience)"
						/>
					</SummaryRow>

					<SummaryRow
						:response="aspectData.designing.design_assist_asked"
						labelKey="aspects.user_journey_model.definitions.designing.design_assist_asked.label"
						:valueKey="`aspects.user_journey_model.options.yes_no_maybe.${aspectData.designing.design_assist_asked}`"
					/>

					<SummaryRow
						:response="aspectData.designing.design_assist_broker"
						labelKey="aspects.user_journey_model.definitions.designing.design_assist_broker.label"
						:valueKey="`aspects.user_journey_model.options.design_assist_broker.${aspectData.designing.design_assist_broker}`"
					/>

				</SummaryBlock>



				<!-- Instigating -->

				<SummaryBlock :title="$t('aspects.user_journey_model.definitions.instigating.title')">

					<SummaryRow
						:response="aspectData.instigating.identify_role"
						labelKey="aspects.user_journey_model.definitions.instigating.identify_role.label"
						:valueKey="`aspects.user_journey_model.options.yes_no_maybe.${aspectData.instigating.identify_role}`"
					/>

					<SummaryRow
						:response="aspectData.instigating.identify_method"
						labelKey="aspects.user_journey_model.definitions.instigating.identify_method.label"
						:valueKey="`aspects.user_journey_model.options.methods.${aspectData.instigating.identify_method}`"
					/>

					<SummaryRow
						labelKey="aspects.user_journey_model.definitions.instigating.identify_experience.label"
					>
						<img
							class="img-responsive img-experience"
							v-if="aspectData.instigating.identify_experience"
							:src="experienceImage(aspectData.instigating.identify_experience)"
						/>
					</SummaryRow>

					<SummaryRow
						:response="aspectData.instigating.design_role"
						:linkify="true"
						labelKey="aspects.user_journey_model.definitions.instigating.design_role.label"
					/>

					<SummaryRow
						labelKey="aspects.user_journey_model.definitions.instigating.instigate_role.label"
					>
						<ul>
							<li v-for="roleName in aspectData.instigating.instigate_role">
								{{ $t(`aspects.user_journey_model.options.instigate_roles.${roleName}`) }}
							</li>
						</ul>
					</SummaryRow>

					<SummaryRow
						:response="aspectData.instigating.comments"
						:linkify="true"
						labelKey="aspects.user_journey_model.definitions.instigating.comments.label"
					/>

				</SummaryBlock>


			</div>
		</div>
	</main>

</template>

<script>

import { linkify } from '@/plugins/linkify';
import { get, set, sync, call } from 'vuex-pathify';
import find from 'lodash/find';

import SummaryBlock from '@/components/project/view/SummaryBlock';
import SummaryRow from '@/components/project/view/SummaryRow';

import Aspects from '@/aspects';

const FACE_TYPES = {
	'negative': 'user-journey/face-frown.svg',
	'neutral': 'user-journey/face-neutral.svg',
	'positive': 'user-journey/face-smile.svg',
};

export default {

	name: "UserJourneySummaryView",

	components: {
		SummaryBlock,
		SummaryRow,
	},

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

.img-experience {
	max-width: 48px;
}
</style>
