<template>

	<v-group>

		<CosmosTitle :aspectId="aspectId" :options="options" />

		<v-group :config="{
			x: 0,
			y: 80,
		}">

			<CosmosImage :config="bgConfig.brain" />
			<CosmosImage :config="bgConfig.firstLoop" />
			<CosmosImage :config="bgConfig.secondLoop" />
			<CosmosImage :config="bgConfig.thirdLoop" />
			<CosmosImage :config="bgConfig.zeroFourthLoop" />

			<v-text :config="zeroOrderConfig" />
			<v-text :config="fourthOrderConfig" />

			<v-text
				v-for="(config, name) in firstOrderConfigs"
				:key="'first' + name"
				:config="config"
			/>

			<v-text
				v-for="(config, name) in secondOrderConfigs"
				:key="'second' + name"
				:config="config"
			/>

			<v-text
				v-for="(config, name) in thirdOrderConfigs"
				:key="'third' + name"
				:config="config"
			/>

		</v-group>

	</v-group>

</template>

<script>

import { get } from 'vuex-pathify';
import map from 'lodash/map';
import find from 'lodash/find';
import filter from 'lodash/filter';

const defaultTextConfig = {
	fontSize: 32,
	// fontStyle: 'bold',
	fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
	lineHeight: 1.2,
	align: 'left'
};

export default {

	name: 'TheoryOfChangeDashboard',

	props: {
		aspectId: [Boolean, String],
		options: Object,
		definitions: [Object, Array],
	},

	computed: {

		...get(['userGuide']),

		dataPath() {
			if (this.userGuide.isOpen) {
				return `userGuide@project.data.${this.aspectId}`;
			} else {
				return `project@data.${this.aspectId}`;
			}
		},

		aspectData: get(':dataPath'),

		bgConfig() {

			var data = {};

			var defaults = {
				x: 0,
				y: 0,
				opacity: 1,
			};

			data.brain = {
				...defaults,
				filename: 'theory-of-change/dashboard-brain.png',
			};

			data.firstLoop = {
				...defaults,
				filename: 'theory-of-change/dashboard-first-loop.png',
			};

			data.secondLoop = {
				...defaults,
				filename: 'theory-of-change/dashboard-second-loop.png',
			};

			data.thirdLoop = {
				...defaults,
				filename: 'theory-of-change/dashboard-third-loop.png',
			};

			data.zeroFourthLoop = {
				...defaults,
				filename: 'theory-of-change/dashboard-zero-fourth-loop.png',
			};


			if (this.userGuide.isOpen) {
				data.firstLoop.opacity = this.userGuide.currentStep >= 0 ? 1 : 0;
				data.secondLoop.opacity = this.userGuide.currentStep >= 1 ? 1 : 0;
				data.thirdLoop.opacity = this.userGuide.currentStep >= 4 ? 1 : 0;
				data.zeroFourthLoop.opacity = this.userGuide.currentStep >= 5 ? 1 : 0;
				data.brain.opacity = this.userGuide.currentStep >= 6 ? 1 : 0;
			}

			return data;
		},

		firstOrderConfigs() {

			var configs = {};

			configs.label = {
				...defaultTextConfig,
				text: this.$t('aspects.change_model.dashboard.first_order'),
				fill: '#947194',
				x: 480,
				y: 435,
				visible: false,
			};

			configs.risk = {
				...defaultTextConfig,
				text: this.$t('aspects.change_model.dashboard.risk'),
				fill: '#d317a4',
				x: 345,
				y: 600,
				visible: false,
			};

			configs.vision = {
				...defaultTextConfig,
				text: this.$t('aspects.change_model.dashboard.vision'),
				fill: '#255d4d',
				x: 440,
				y: 375,
				visible: false,
			};

			configs.plan = {
				...defaultTextConfig,
				text: this.$t('aspects.change_model.dashboard.plan'),
				fill: '#255d4d',
				x: 705,
				y: 515,
				visible: false,
			};

			configs.execute = {
				...defaultTextConfig,
				text: this.$t('aspects.change_model.dashboard.execute'),
				fill: '#255d4d',
				x: 435,
				y: 670,
				visible: false,
			};

			configs.measure = {
				...defaultTextConfig,
				text: this.$t('aspects.change_model.dashboard.measure'),
				fill: '#255d4d',
				x: 155,
				y: 520,
				visible: false,
			};

			if (this.userGuide.isOpen) {

				configs.vision.visible = true;
				configs.plan.visible = true;
				configs.execute.visible = true;
				configs.measure.visible = true;

				configs.label.visible = (this.userGuide.currentStep >= 2);
				configs.risk.visible = (this.userGuide.currentStep >= 3);

			} else {

				var hasVision = this.aspectData.first_order.vision.length > 0;
				var hasPlan = this.aspectData.first_order.plan.length > 0;
				var hasExecute = this.aspectData.first_order.execute.length > 0;
				var hasMeasure = this.aspectData.first_order.measure.length > 0;

				if (hasVision && hasPlan && hasExecute && hasMeasure) {
					configs.label.visible = true;
					configs.risk.visible = true;
				}

				configs.vision.visible = hasVision;
				configs.plan.visible = hasPlan;
				configs.execute.visible = hasExecute;
				configs.measure.visible = hasMeasure;
			}

			return configs;
		},

		secondOrderConfigs() {

			var configs = {};

			configs.label = {
				...defaultTextConfig,
				text: this.$t('aspects.change_model.dashboard.second_order'),
				fill: '#cab5ca',
				x: 390,
				y: 165,
				visible: false,
			};

			configs.ambiguity = {
				...defaultTextConfig,
				text: this.$t('aspects.change_model.dashboard.ambiguity'),
				fill: '#d317a4',
				x: 270,
				y: 115,
				visible: false,
			};

			configs.sense_making = {
				...defaultTextConfig,
				text: this.$t('aspects.change_model.dashboard.sense_making'),
				fill: '#a8bdb7',
				x: 100,
				y: 215,
				visible: false,
			};

			configs.languaging = {
				...defaultTextConfig,
				text: this.$t('aspects.change_model.dashboard.languaging'),
				fill: '#a8bdb7',
				x: 350,
				y: 65,
				visible: false,
			};

			configs.committing = {
				...defaultTextConfig,
				text: this.$t('aspects.change_model.dashboard.committing'),
				fill: '#a8bdb7',
				x: 590,
				y: 215,
				visible: false,
			};

			if (this.userGuide.isOpen) {

				configs.sense_making.visible = (this.userGuide.currentStep >= 1);
				configs.languaging.visible = (this.userGuide.currentStep >= 1);
				configs.committing.visible = (this.userGuide.currentStep >= 1);

				configs.label.visible = (this.userGuide.currentStep >= 2);
				configs.ambiguity.visible = (this.userGuide.currentStep >= 3);

			} else {

				var hasSenseMaking = this.aspectData.second_order.sense_making.length > 0;
				var hasLanguaging = this.aspectData.second_order.languaging.length > 0;
				var hasCommitting = this.aspectData.second_order.committing.length > 0;

				if (hasSenseMaking && hasLanguaging && hasCommitting) {
					configs.label.visible = true;
					configs.ambiguity.visible = true;
				}

				configs.sense_making.visible = hasSenseMaking;
				configs.languaging.visible = hasLanguaging;
				configs.committing.visible = hasCommitting;

			}

			return configs;
		},

		thirdOrderConfigs() {

			var configs = {};

			configs.label = {
				...defaultTextConfig,
				text: this.$t('aspects.change_model.dashboard.third_order'),
				fill: '#3c003c',
				x: 45,
				y: 295,
				width: 100,
				align: 'center',
				visible: false,
			};

			configs.ambivalence = {
				...defaultTextConfig,
				text: this.$t('aspects.change_model.dashboard.ambivalence'),
				fill: '#d317a4',
				x: 340,
				y: 295,
				visible: false,
				rotation: -4,
			};

			if (this.userGuide.isOpen) {

				configs.label.visible = (this.userGuide.currentStep >= 4);
				configs.ambivalence.visible = (this.userGuide.currentStep >= 4);

			} else {

				var hasProcesses = this.aspectData.third_order.processes.length > 0;

				if (hasProcesses) {
					configs.label.visible = true;
					configs.ambivalence.visible = true;
				}

			}

			return configs;
		},

		zeroOrderConfig() {

			var isVisible = false;

			if (this.userGuide.isOpen) {
				isVisible = this.userGuide.currentStep >= 5;
			} else {
				isVisible = true;
			}

			var config = {
				text: this.$t('aspects.change_model.dashboard.zero_order'),
				fill: '#2d2d68',
				x: 880,
				y: 615,
				width: 200,
				height: 85,
				align: 'center',
				verticalAlign: 'middle',
				visible: isVisible,
			};

			return {...defaultTextConfig, ...config};
		},

		fourthOrderConfig() {

			var isVisible = false;

			if (this.userGuide.isOpen) {
				isVisible = this.userGuide.currentStep >= 5;
			} else {
				isVisible = true;
			}

			var config = {
				text: this.$t('aspects.change_model.dashboard.fourth_order'),
				fill: '#947194',
				x: 850,
				y: 5,
				width: 200,
				height: 85,
				align: 'center',
				verticalAlign: 'middle',
				visible: isVisible,
			};

			return {...defaultTextConfig, ...config};
		},

	}

}
</script>
