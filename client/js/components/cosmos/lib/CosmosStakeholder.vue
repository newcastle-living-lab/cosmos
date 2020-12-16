<template>

	<v-group
		ref="group"
		:config="groupConfig"
		@mousemove="mousemove"
		@mouseout="mouseout"
		@click="launchUrl"
		@tap="launchUrl"
	>
		<!-- <v-ellipse ref="circle" :config="circleConfig" /> -->
		<CosmosStakeholderIcon ref="icon" v-bind="iconConfig" />
		<v-text ref="label" :config="labelConfig" />
		<v-text ref="description" :config="descriptionConfig" v-if="descriptionConfig" />
		<a :href="url" target="_blank" ref="link"></a>
	</v-group>

</template>

<script>

import { get, commit } from 'vuex-pathify';

import colours from 'colors.css';
import CosmosStakeholderIcon from './CosmosStakeholderIcon';

export default {

	tween: null,

	name: 'CosmosStakeholder',

	components: {
		CosmosStakeholderIcon,
	},

	props: {
		aspectId: String,
		options: Object,
		definitionName: String,
		descriptionVisible: [String, Boolean],
		config: Object,
	},

	data() {
		return {
			descriptionPosY: 0,
			pos: {
				width: 100,
				icon: 70,
			},
			circlePos: {
				x: 50,
				y: 45,
				radius: {
					x: 45,
					y: 45,
				}
			}
		}
	},

	watch: {
		'model.label': 'refreshPositions',
		'isVisible': 'refreshPositions',
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

		model() {
			return this.aspectData && this.aspectData[this.definitionName] ? this.aspectData[this.definitionName] : {};
		},

		isVisible() {

			if (typeof(this.config.group.visible) !== 'undefined') {
				return this.config.group.visible;
			}

			return this.model.label
				&& this.model.label.length > 0
				? true : false;
		},

		url() {
			return this.model.url ? this.model.url : false;
		},

		groupConfig() {
			return {
				// visible: this.isVisible,
				opacity: 1,
				x: this.config.group.x,
				y: this.config.group.y
			}
		},

		iconConfig() {
			return {
				visible: this.isVisible,
				x: 0,
				y: 0,
				colour: this.model.colour,
				type: this.model.type,
				width: this.pos.width,
				size: this.pos.icon,
			};
		},

		// circleConfig() {
		// 	return {
		// 		visible: this.circle && this.value.label ? true : false,
		// 		x: this.circlePos.x,
		// 		y: this.circlePos.y,
		// 		radius: this.circlePos.radius,
		// 		stroke: colours.olive,
		// 		strokeWidth: 3,
		// 		fill: '#ffffff',
		// 	}
		// },

		labelConfig() {

			var label = this.model ? this.model.label : '';

			var config = {
				visible: this.isVisible,
				text: label,
				fontSize: 13,
				fontStyle: 'bold',
				fontFamily: this.options.fontFamily,
				lineHeight: 1.3,
				x: 0,
				y: this.pos.icon + 30,
				width: this.pos.width,
				padding: 0,
				align: 'center',
			}

			return config;
		},

		descriptionConfig() {

			var label = this.config && this.config.description ? this.config.description : false;
			if (label === false) {
				return false;
			}

			var config = {
				visible: this.descriptionVisible === true || this.isVisible,
				fill: '#999999',
				text: label,
				fontSize: 11,
				fontFamily: this.options.fontFamily,
				lineHeight: 1.3,
				x: -15,
				y: this.descriptionPosY,	//this.pos.icon + 30 + 20,
				width: this.pos.width + 30,
				padding: 0,
				align: 'center',
			}

			return config;
		},

	},

	methods: {

		mousemove() {
			if (this.url) {
				commit('START_STAGE_HOVER');
			}
		},

		mouseout() {
			if (this.url) {
				commit('STOP_STAGE_HOVER');
			}
		},

		launchUrl() {
			if (this.url) {
				this.$refs.link.click();
			}
		},

		refreshPositions() {

			if ( ! this.descriptionConfig) {
				return;
			}

			var refs = {
				label: this.$refs.label,
				description: this.$refs.description,
			};

			// if ( ! refs.label) {
			// 	return;
			// }

			console.log("refreshPositions");
			// console.log("refreshPositions");

			this.$nextTick(() => {
				this.descriptionPosY =
					this.pos.icon
					+ 30
					+ parseInt(refs.label.getNode().getClientRect().height, 10)
					+ 5;
				console.log(this.descriptionPosY);
			});
		}
	},

	mounted() {
		this.refreshPositions();
	}

}
</script>
