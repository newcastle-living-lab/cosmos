<template>

	<main ref="container" class="app-content light moral-summary" v-if="aspectData">
		<div class="scrollable scr-y">
			<div class="container grid-xl">
				<h1 class="h4 mb-8 mt-4" v-if="aspectData.model">{{ aspectData.model.title }}</h1>

				<div class="divider"></div>

				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">{{ $t('aspects.moral_ordering_model.dashboard.define_ethos') }}</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.defineEthos.values.label') }}</td>
									<td class="group-value like-pre">{{ aspectData.defineEthos.values }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.defineEthos.definedBy.label') }}</td>
									<td class="group-value">{{ optionListLabel(definitionsById.defineEthos.children.definedBy, aspectData.defineEthos.definedBy) }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.defineEthos.evidenceUrl.label') }}</td>
									<td class="group-value"><EvidenceLink :url="aspectData.defineEthos.evidenceUrl" /></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="divider"></div>

				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">{{ $t('aspects.moral_ordering_model.dashboard.plan_manage') }}</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.planManagePrior.actions.label') }}</td>
									<td class="group-value">{{ aspectData.planManagePrior.actions }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.planManagePrior.actors.label') }}</td>
									<td class="group-value">
										<StakeholderTile
											v-for="(actor, idx) in aspectData.planManagePrior.actors"
											:key="idx"
											:stakeholder="actor"
										/>
									</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.planManagePrior.evidenceUrl.label') }}</td>
									<td class="group-value"><EvidenceLink :url="aspectData.planManagePrior.evidenceUrl" /></td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.planManageCurrent.actions.label') }}</td>
									<td class="group-value like-pre">{{ aspectData.planManageCurrent.actions }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.planManageCurrent.actors.label') }}</td>
									<td class="group-value">
										<StakeholderTile
											v-for="(actor, idx) in aspectData.planManageCurrent.actors"
											:key="idx"
											:stakeholder="actor"
										/>
									</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.planManageCurrent.evidenceUrl.label') }}</td>
									<td class="group-value"><EvidenceLink :url="aspectData.planManageCurrent.evidenceUrl" /></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="divider"></div>

				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">{{ $t('aspects.moral_ordering_model.dashboard.deliver') }}</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.deliver.method.label') }}</td>
									<td class="group-value">{{ optionListLabel(definitionsById.deliver.children.method, aspectData.deliver.method) }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.deliver.actors.label') }}</td>
									<td class="group-value">
										<StakeholderTile
											v-for="(actor, idx) in aspectData.deliver.actors"
											:key="idx"
											:stakeholder="actor"
										/>
									</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.deliver.evidenceUrl.label') }}</td>
									<td class="group-value"><EvidenceLink :url="aspectData.deliver.evidenceUrl" /></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="divider"></div>

				<div class="columns">
					<div class="column col-3">
						<h2 class="group-title">{{ $t('aspects.moral_ordering_model.dashboard.govern') }}</h2>
					</div>
					<div class="column col-9">
						<table class="table">
							<tbody>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.govern.actions.label') }}</td>
									<td class="group-value like-pre">{{ aspectData.govern.actions }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.govern.actors.label') }}</td>
									<td class="group-value">
										<StakeholderTile
											v-for="(actor, idx) in aspectData.govern.actors"
											:key="idx"
											:stakeholder="actor"
										/>
									</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.govern.outcomes.label') }}</td>
									<td class="group-value like-pre">{{ aspectData.govern.outcomes }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.govern.evolution.label') }}</td>
									<td class="group-value like-pre">{{ aspectData.govern.evolution }}</td>
								</tr>
								<tr>
									<td class="group-prompt">{{ $t('aspects.moral_ordering_model.definitions.govern.improvements.label') }}</td>
									<td class="group-value like-pre">{{ aspectData.govern.improvements }}</td>
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

import { get, set, sync, call } from 'vuex-pathify';
import find from 'lodash/find';

import Aspects from '@/aspects';

import StakeholderTile from './StakeholderTile';

const EvidenceLink = {
	props: {
		url: String
	},
	template: `<a class="link" :href="url" target="_blank">{{ url }}</a>`
};

export default {

	name: "MoralSummaryView",

	components: {
		StakeholderTile,
		EvidenceLink,
	},

	props: {
		aspectId: [Boolean, String],
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

		optionListLabel(definitionObj, value) {
			var item = find(definitionObj.componentProps.options, { 'value': value });
			return item ? this.$t(item.lang) : '(Unknown)';
		},

		nl2br(value) {
			return value.replace(/(?:\r\n|\r|\n)/g, '<br>');
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
</style>
