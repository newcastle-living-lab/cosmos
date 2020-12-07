<template>

	<v-group
		ref="group"
		:config="groupConfig"
		@click="handleActivate"
		@tap="handleActivate"
		@dragend="handleDragEnd"
		@mousemove="handleMouseMove"
		@mouseout="handleMouseOut"
	>
		<v-circle
			v-for="(circle, idx) in circlesConfig"
			:key="'circle' + idx"
			:config="circle"
		/>
	</v-group>

</template>

<script>

import { commit } from 'vuex-pathify';
import colours from 'colors.css';

export default {

	name: 'CosmosVisualAnnotation',

	props: {
		annotation: Object,
	},

	data() {
		return {
			isHovering: false
		}
	},

	computed: {

		groupConfig() {
			return {
				x: this.annotation.position[0],
				y: this.annotation.position[1],
				draggable: true,
			}
		},

		circlesConfig() {

			const defaultConfig = {
				x: 0,
				y: 0,
				fill: this.isHovering ? colours.fuchsia : colours.purple,
			};

			var circles = [];

			circles.push({
				...defaultConfig,
				radius: 12,
				opacity: 0.5,
			});

			circles.push({
				...defaultConfig,
				radius: 8,
				opacity: 1,
			});

			return circles;
		},

	},

	methods: {

		handleDragEnd(event) {
			console.log(event);
			this.annotation.position = [
				event.target.attrs.x,
				event.target.attrs.y,
			];
		},


		handleMouseMove() {
			this.isHovering = true;
			commit('START_STAGE_HOVER');
		},

		handleMouseOut() {
			this.isHovering = false;
			commit('STOP_STAGE_HOVER');
		},

		handleActivate(evt) {
			evt.cancelBubble = true;
			this.$emit('activate', this.annotation);
		}

	}

}
</script>
