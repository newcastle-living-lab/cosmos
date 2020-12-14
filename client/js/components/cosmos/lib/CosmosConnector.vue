<template>

	<v-group :config="{ visible: this.visible }">
		<v-line ref="line" :config="lineConfig" />
		<v-circle v-for="(circle, idx) in circlesConfig" :key="idx" :config="circle" />
	</v-group>

</template>

<script>

const defaultConfig = {
	color: '#cccccc',
	dash: [10, 5],
	strokeWidth: 1,
	start: [],
	end: [],
	radius: 10,
};

const defaultLineConfig = {
	x: 0,
	y: 0,
	strokeWidth: 1,
	dash: [6, 3],
};

const defaultCircleConfig = {
	fill: '#cccccc',
};

export default {

	name: 'CosmosConnector',

	props: {
		options: Object,
		config: Object,
	},

	computed: {

		visible() {
			return (typeof(this.mergedConfig.visible) === undefined ? true : this.mergedConfig.visible);
		},

		mergedConfig() {
			return { ...defaultConfig, ...this.config };
		},

		circlesConfig() {

			var circles = [];

			circles.push({
				...defaultCircleConfig,
				x: this.mergedConfig.start[0],
				y: this.mergedConfig.start[1],
				fill: this.mergedConfig.colour,
				radius: this.mergedConfig.radius,
			});

			circles.push({
				...defaultCircleConfig,
				x: this.mergedConfig.end[0],
				y: this.mergedConfig.end[1],
				fill: this.mergedConfig.colour,
				radius: this.mergedConfig.radius,
			});

			return circles;
		},

		lineConfig() {

			const mergedConfig = this.mergedConfig;

			var config = {
				...defaultLineConfig,
				stroke: mergedConfig.colour,
				strokeWidth: mergedConfig.strokeWidth,
				dash: mergedConfig.dash,
				points: [
					mergedConfig.start[0],
					mergedConfig.start[1],
					mergedConfig.end[0],
					mergedConfig.end[1],
				]
			};

			return config;
		},

	}

}
</script>
