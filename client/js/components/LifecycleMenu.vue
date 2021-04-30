
<template>
	<div class="lifecycle">

		<div class="mb-8">
			<p class="mb-2">{{ $t('lifecycle.welcome') }}</p>
			<p>{{ $t('lifecycle.intro') }}</p>
		</div>

		<v-stage ref="stage" :config="stageConfig">
			<v-layer>

				<v-group>
					<v-circle :config="circleConfig" />
					<v-line :config="linesConfig.x" />
					<v-line :config="linesConfig.y" />
				</v-group>

				<v-text
					v-for="(config, idx) in headings"
					:key="'heading' + idx"
					:config="config"
				/>

				<v-text
					v-for="(config, idx) in models"
					:key="'model' + idx"
					:config="config"
					@mousemove="mousemove"
					@mouseout="mouseout"
					@click="launchModel(config.name)"
					@tap="launchModel(config.name)"
				/>

			</v-layer>
		</v-stage>

	</div>
</template>

<script>

import { get, sync, dispatch, commit } from 'vuex-pathify';

import Aspects from '@/aspects';

import colours from 'colors.css';

const defaultTextConfig = {
	fontSize: 14,
	fontStyle: 'normal',
	fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
	lineHeight: 1.2,
	align: 'center'
};


export default {

	name: 'LifecycleMenu',


	watch: {
		'stageHover': 'setCursor',
	},

	data() {
		return {
			stageConfig: {
				width: 450,
				height: 450,
				scale: {
					x: 1,
					y: 1,
				}
			},
		}
	},


	computed: {

		...get([
			'stageHover',
			'userCanEdit',
		]),

		availableModels: get('project@config.models'),

		circleConfig() {

			let config = {
				x: Math.floor(this.stageConfig.width / 2),
				y: Math.floor(this.stageConfig.height / 2),
				radius: Math.floor(this.stageConfig.height / 2) - 10,
				strokeWidth: 2,
				stroke: '#111111',
			};

			return config;

		},

		linesConfig() {

			let width = this.stageConfig.width;
			let height = this.stageConfig.height;
			let halfWidth = Math.floor(this.stageConfig.width / 2);
			let halfHeight = Math.floor(this.stageConfig.height / 2);

			let line = {
				stroke: '#111111',
				strokeWidth: 2,
			};

			return {

				x: {
					...line,
					points: [10, halfHeight + 5, width - 10, halfHeight + 5 ],
				},

				y: {
					...line,
					points: [halfWidth + 5, 10, halfWidth + 5, height - 10 ],
				}

			}
		},

		headings() {

			let headings = [];

			let halfWidth = Math.floor(this.stageConfig.width / 2);
			let halfHeight = Math.floor(this.stageConfig.height / 2);

			let yOffset = 50;

			// Learning
			headings.push({
				...defaultTextConfig,
				align: 'right',
				x: 0,
				y: yOffset,
				width: halfWidth,
				// height: halfHeight,
				padding: 20,
				text: this.$t(`lifecycle.learning`),
				fontSize: 16,
				fontStyle: 'bold',
			});

			// Strategising
			headings.push({
				...defaultTextConfig,
				align: 'left',
				x: halfWidth + 10,
				y: yOffset,
				width: halfWidth,
				// height: halfHeight,
				padding: 20,
				text: this.$t(`lifecycle.strategising`),
				fontSize: 16,
				fontStyle: 'bold',
			});

			// Evaluating
			headings.push({
				...defaultTextConfig,
				align: 'right',
				x: 0,
				y: halfHeight,
				width: halfWidth,
				// height: halfHeight,
				padding: 20,
				text: this.$t(`lifecycle.evaluating`),
				fontSize: 16,
				fontStyle: 'bold',
			});

			// Resourcing
			headings.push({
				...defaultTextConfig,
				align: 'left',
				x: halfWidth + 10,
				y: halfHeight,
				width: halfWidth,
				// height: halfHeight,
				padding: 20,
				text: this.$t(`lifecycle.resourcing`),
				fontSize: 16,
				fontStyle: 'bold',
			});

			return headings;
		},

		models() {

			let halfWidth = Math.floor(this.stageConfig.width / 2);
			let halfHeight = Math.floor(this.stageConfig.height / 2);

			let yOffset = 100;

			let itemHeight = 25;

			let models = [];

			let modelName = null;

			let modelTextConfig = {
				padding: 5,
				fontSize: 14,
				fontStyle: 'normal',
			};

			/**
			 * Learning
			 *
			 */

			let learningY = yOffset;

			modelName = 'change_model';
			models.push({
				...defaultTextConfig,
				...modelTextConfig,
				align: 'right',
				x: -15,
				y: learningY,
				width: halfWidth,
				text: this.$t(`aspects.change_model.title`),
				fill: this.hasModel(modelName) ? colours.black : colours.gray,
				name: this.hasModel(modelName) ? modelName : null,
			});

			learningY += itemHeight;
			modelName = 'intervention_theory_model';
			models.push({
				...defaultTextConfig,
				...modelTextConfig,
				align: 'right',
				x: -15,
				y: learningY,
				width: halfWidth,
				text: this.$t(`aspects.intervention_theory_model.title`),
				fill: this.hasModel(modelName) ? colours.black : colours.gray,
				name: this.hasModel(modelName) ? modelName : null,
			});

			learningY += itemHeight;
			modelName = 'moral_ordering_model';
			models.push({
				...defaultTextConfig,
				...modelTextConfig,
				align: 'right',
				x: -15,
				y: learningY,
				width: halfWidth,
				text: this.$t(`aspects.moral_ordering_model.title`),
				fill: this.hasModel(modelName) ? colours.black : colours.gray,
				name: this.hasModel(modelName) ? modelName : null,
			});


			/**
			 * Evaluating
			 *
			 */

			let evalY = halfHeight + 45;

			models.push({
				...defaultTextConfig,
				...modelTextConfig,
				align: 'right',
				x: -15,
				y: evalY,
				width: halfWidth,
				text: this.$t('aspects.theory_of_change.title'),
				name: 'theory_of_change',
			});

			evalY += itemHeight;
			models.push({
				...defaultTextConfig,
				...modelTextConfig,
				align: 'right',
				x: -15,
				y: evalY,
				width: halfWidth,
				text: this.$t(`aspects.community_reporting.title`),
				name: 'community_reporting',
			});

			evalY += itemHeight;
			modelName = 'user_journey_model';
			models.push({
				...defaultTextConfig,
				...modelTextConfig,
				align: 'right',
				x: -15,
				y: evalY,
				width: halfWidth,
				text: this.$t(`aspects.user_journey_model.title`),
				fill: this.hasModel(modelName) ? colours.black : colours.gray,
				name: this.hasModel(modelName) ? modelName : null,
			});

			evalY += itemHeight;
			models.push({
				...defaultTextConfig,
				...modelTextConfig,
				align: 'right',
				x: -15,
				y: evalY,
				width: halfWidth,
				text: this.$t(`aspects.social_media.title`),
				name: 'social_media',
			});

			evalY += itemHeight;
			models.push({
				...defaultTextConfig,
				...modelTextConfig,
				align: 'right',
				x: -15,
				y: evalY,
				width: halfWidth,
				text: this.$t(`aspects.documents.title`),
				name: 'documents',
			});


			/**
			 * Strategising
			 *
			 */

			let stratY = yOffset;
			modelName = 'intervention_theory_model';
			models.push({
				...defaultTextConfig,
				...modelTextConfig,
				align: 'left',
				x: halfWidth + 20,
				y: stratY,
				width: halfWidth * 0.7,
				text: this.$t('aspects.intervention_theory_model.title'),
				fill: this.hasModel(modelName) ? colours.black : colours.gray,
				name: this.hasModel(modelName) ? modelName : null,
			});

			stratY += (itemHeight * 1.8);
			modelName = 'user_journey_model';
			models.push({
				...defaultTextConfig,
				...modelTextConfig,
				align: 'left',
				x: halfWidth + 20,
				y: stratY,
				width: halfWidth,
				text: 'User Journey Model',
				fill: this.hasModel(modelName) ? colours.black : colours.gray,
				name: this.hasModel(modelName) ? modelName : null,
			});

			stratY += itemHeight;
			modelName = 'analytic_model';
			models.push({
				...defaultTextConfig,
				...modelTextConfig,
				align: 'left',
				x: halfWidth + 20,
				y: stratY,
				width: halfWidth,
				text: this.$t(`aspects.analytic_model.title`),
				fill: this.hasModel(modelName) ? colours.black : colours.gray,
				name: this.hasModel(modelName) ? modelName : null,
			});


			/**
			 * Resourcing
			 *
			 */

			let resY = halfHeight + 45;
			modelName = 'co_creation_of_service_model';
			models.push({
				...defaultTextConfig,
				...modelTextConfig,
				align: 'left',
				x: halfWidth + 25,
				y: resY,
				width: halfWidth * 0.7,
				text: this.$t(`aspects.co_creation_of_service_model.title`),
				fill: this.hasModel(modelName) ? colours.black : colours.gray,
				name: this.hasModel(modelName) ? modelName : null,
				lineHeight: 1.4
			});

			return models;
		},

		projectModels() {
			return Array.isArray(this.availableModels) ? this.availableModels : []
		},

	},

	methods: {

		hasModel(name) {
			return this.projectModels.includes(name);
		},

		setCursor() {
			var cursor = this.stageHover ? 'pointer' : 'default';
			this.$refs.stage.getStage().container().style.cursor = cursor;
		},

		mousemove() {
			this.isHovering = true;
			commit('START_STAGE_HOVER');
		},

		mouseout() {
			this.isHovering = false;
			commit('STOP_STAGE_HOVER');
		},

		launchModel(name) {

			this.isHovering = false;
			commit('STOP_STAGE_HOVER');

			if ( ! name || ! name.length) return;

			if (this.userCanEdit) {
				commit('EDIT_ASPECT', name);
				return;
			}

			const aspect = Aspects.get(name);
			this.$router.push({ name: aspect.CONFIG.routeName, params: {...this.$route.params, aspectId: aspect.CONFIG.id } });

		}

	},

}
</script>


<style lang="scss">
.lifecycle {
	.konvajs-content {
		margin: 0 auto;
	}
}
</style>
