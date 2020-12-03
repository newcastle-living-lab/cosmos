<template>

	<v-group>

		<v-group v-for="(stage, idx) in journeyStagesConfig" :key="'stage' + idx">
			<v-label :config="stage.label">
				<v-tag :config="stage.tag" />
				<v-text :config="stage.text" />
			</v-label>
		</v-group>

		<v-group v-for="(text, idx) in flowchartTextConfig" :key="'flowText' + idx" :config="{ x: 440, y: 130 }">
			<CosmosTextBox :options="options" :config="text" />
		</v-group>

		<v-group v-for="(text, idx) in flowchartLabelsConfig" :key="'flowLabel' + idx" :config="{ x: 440, y: 130 }">
			<v-text :config="text" />
		</v-group>

		<v-group v-for="(arrow, idx) in flowchartArrowsConfig" :key="'flowArrow' + idx" :config="{ x: 440, y: 130 }">
			<v-arrow :config="arrow" />
		</v-group>

		<v-group :config="{ x: 100, y: 85 }">
			<v-rect :config="sipConfig.rect" />
			<v-text :config="sipConfig.label" />
			<CosmosTextBox
				v-for="(text, idx) in sipConfig.boxes"
				:key="'sipBox' + idx"
				:config="text"
				:options="options"
			/>
			<v-arrow
				v-for="(arrow, idx) in sipConfig.lines"
				:key="'sipLine' + idx"
				:config="arrow"
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
	fontSize: 24,
	fontStyle: 'bold',
	fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
	lineHeight: 1.2,
	align: 'center'
};

export default {

	name: 'UserJourneyDashboard',

	props: {
		aspectId: [Boolean, String],
		options: Object,
		definitions: [Object, Array],
	},

	data() {
		return {
			labelConfig: {
				x: 170,
				y: 75,
				opacity: 0.75,
			},
			tagConfig: {
				fill: "black",
				pointerDirection: "down",
				pointerWidth: 10,
				pointerHeight: 10,
				lineJoin: "round",
			},
			textConfig: {
				text: "Tooltip pointing down",
				fontFamily: "Calibri",
				fontSize: 18,
				padding: 5,
				fill: "white",
			},
		}
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

			return data;
		},

		journeyStagesConfig() {

			var data = {};

			const tagConfig = {
				fill: '#aaaaaa',
				pointerDirection: 'right',
				pointerWidth: 18,
				pointerHeight: 56,
				lineJoin: 'round',
			};

			const textConfig = {
				...defaultTextConfig,
				width: 180,
				text: 'STAGE',
				fontStyle: 'normal',
				fontSize: 20,
				padding: 18,
				fill: '#ffffff',
			};

			function xPos(itemNum) {
				const offset = 385;
				return offset + (itemNum * 180);
			};

			const yPos = 555;

			data.evaluating = {
				label: { x: xPos(5), y: yPos, },
				tag: { ...tagConfig, fill: '#604A7B', pointerHeight: 0 },
				text: { ...textConfig, text: 'Evaluating' },
			};

			data.using = {
				label: { x: xPos(4), y: yPos, },
				tag: { ...tagConfig, fill: '#FAC090', },
				text: { ...textConfig, text: 'Using' },
			};

			data.accessing = {
				label: { x: xPos(3), y: yPos, },
				tag: { ...tagConfig, fill: '#D99694', },
				text: { ...textConfig, text: 'Accessing' },
			};

			data.discovering = {
				label: { x: xPos(2), y: yPos, },
				tag: { ...tagConfig, fill: '#4F81BD', },
				text: { ...textConfig, text: 'Discovering' },
			};

			data.designing = {
				label: { x: xPos(1), y: yPos, },
				tag: { ...tagConfig, fill: '#79C36F', },
				text: { ...textConfig, text: 'Designing' },
			};

			data.instigating = {
				label: { x: xPos(0), y: yPos, },
				tag: { ...tagConfig, fill: '#DC5C52', },
				text: { ...textConfig, text: 'Instigating' },
			};

			return data;
		},

		flowchartTextConfig() {

			var data = [];

			const defaultConfig = {
				labelConfig: { fontStyle: 'normal', fontSize: 16 },
				borderConfig: { cornerRadius: 0, strokeWidth: 2 },
			};

			data.push({
				...defaultConfig,
				label: "Service Definition",
				x: 0,
				y: 140,
				textWidth: 105,
				width: 115,
				height: 60,
			});

			data.push({
				...defaultConfig,
				label: "Service Resourcing",
				x: 130,
				y: 30,
				textWidth: 125,
				width: 155,
				height: 60,
			});

			data.push({
				...defaultConfig,
				label: "Reservation & Scheduling",
				x: 305,
				y: 30,
				textWidth: 175,
				width: 185,
				height: 60,
			});

			data.push({
				...defaultConfig,
				label: "Service Delivery",
				x: 515,
				y: 30,
				textWidth: 100,
				width: 130,
				height: 60,
			});

			data.push({
				...defaultConfig,
				label: "Service Publicity",
				x: 130,
				y: 150,
				textWidth: 135,
				width: 165,
				height: 40,
			});

			data.push({
				...defaultConfig,
				label: "Qualifying Agent",
				x: 315,
				y: 150,
				textWidth: 135,
				width: 165,
				height: 40,
			});

			data.push({
				...defaultConfig,
				label: "Evaluating Agent",
				x: 700,
				y: 140,
				textWidth: 100,
				width: 125,
				height: 60,
			});

			data.push({
				...defaultConfig,
				label: "Potential Beneficiary",
				x: 125,
				y: 315,
				textWidth: 130,
				width: 165,
				height: 60,
			});

			data.push({
				...defaultConfig,
				label: "Applicant",
				x: 315,
				y: 325,
				textWidth: 130,
				width: 165,
				height: 40,
			});

			data.push({
				...defaultConfig,
				label: "Client",
				x: 490,
				y: 325,
				textWidth: 130,
				width: 165,
				height: 40,
			});

			return data;
		},

		flowchartLabelsConfig() {

			var data = [];

			const defaultConfig = {
				...defaultTextConfig,
				text: '',
				textAlign: 'center',
				verticalAlign: 'middle',
				fontStyle: 'italic',
				fontSize: 16,
				fill: '#c00000',
			};

			data.push({
				...defaultConfig,
				text: 'Budget',
				x: 120,
				y: 100,
			});

			data.push({
				...defaultConfig,
				text: 'Service Definition',
				x: 265,
				y: 110,
			});

			data.push({
				...defaultConfig,
				text: 'Outcome Reports',
				x: 715,
				y: 55,
				width: 80,
			});

			data.push({
				...defaultConfig,
				text: 'Provider views',
				x: 600,
				y: 145,
				width: 75,
			});

			data.push({
				...defaultConfig,
				text: 'Service publication',
				x: 155,
				y: 235,
				width: 100,
			});

			data.push({
				...defaultConfig,
				text: 'Application',
				x: 345,
				y: 245,
			});

			data.push({
				...defaultConfig,
				text: 'Service Use',
				x: 525,
				y: 245,
			});

			data.push({
				...defaultConfig,
				text: 'Clients\' views',
				x: 715,
				y: 235,
				width: 90,
			});

			return data;
		},

		flowchartArrowsConfig() {

			var data = [];

			const defaultConfig = {
				x: 0,
				y: 0,
				pointerLength: 8,
				pointerWidth: 8,
				fill: 'black',
				stroke: 'black',
				strokeWidth: 1,
			};

			// Service Def -> Service Resourcing
			data.push({ ...defaultConfig, points: [ 85, 130, 115, 110] });

			// Service Definition -> Service Definition
			data.push({ ...defaultConfig, points: [ 120, 135, 245, 120] });

			// Service Definition -> Service Publicity
			data.push({ ...defaultConfig, points: [ 275, 130, 275, 145] });

			// Service Definition -> Qualifying
			data.push({ ...defaultConfig, points: [ 370, 130, 370, 145] });

			// Service Definition -> Service Delivery
			data.push({
				...defaultConfig,
				tension: 0.6,
				points: [
					430, 120,
					525, 115,
					565, 100
				]
			});

			// Service Delivery -> Service Use
			data.push({ ...defaultConfig, points: [ 570, 100, 570, 240] });

			// Service Delivery -> Provider Views
			data.push({
				...defaultConfig,
				tension: 0.6,
				points: [
					575, 100,
					585, 140,
					600, 155
				]
			});

			// Provider views -> Evaluating Agent
			data.push({ ...defaultConfig, points: [ 675, 165, 695, 165] });

			// Evaluating Agent -> Outcome reports
			data.push({ ...defaultConfig, points: [ 755, 130, 755, 105] });

			// Clients views -> Evaluating Agent
			data.push({ ...defaultConfig, points: [ 755, 230, 755, 210] });

			// Client -> Clients Views
			data.push({
				...defaultConfig,
				tension: 0.3,
				points: [
					660, 350,
					715, 350,
					755, 325,
					760, 285
				]
			});

			// Service Publicity -> Service publication
			data.push({ ...defaultConfig, points: [ 205, 195, 205, 230] });

			// Service publication -> Potential Beneficiary
			data.push({ ...defaultConfig, points: [ 205, 280, 205, 305] });

			// Applicant -> Application
			data.push({ ...defaultConfig, points: [ 390, 315, 390, 275] });

			// Application -> Qualifying Agent
			data.push({ ...defaultConfig, points: [ 390, 240, 390, 205] });

			// Service Use -> Client
			data.push({ ...defaultConfig, points: [ 570, 275, 570, 315] });

			// Outcome reports -> Service definition
			data.push({
				...defaultConfig,
				tension: 0.4,
				points: [
					755, 45,
					745, 20,
					700, 0,
					105, 0,
					75, 130,
				]
			});

			return data;
		},

		sipConfig() {

			var data = {};

			// Outer container
			//

			data.rect = {
				width: 400,
				height: 160,
				fill: '#eeece1',
				strokeWidth: 2,
				stroke: '#000000',
			};

			data.label = {
				...defaultTextConfig,
				width: 400,
				align: 'center',
				lineHeight: 1.3,
				padding: 10,
				fontSize: 18,
				fontStyle: 'normal',
				text: 'Service Instigation and Policymaking',
			};

			// Inner boxes
			//

			data.boxes = [];

			const defaultConfig = {
				labelConfig: { fontStyle: 'normal', fontSize: 16 },
				borderConfig: { fill: '#ffffff', cornerRadius: 0, strokeWidth: 2 },
			};

			data.boxes.push({
				...defaultConfig,
				label: "Pressure / Campaign Group",
				x: 10,
				y: 85,
				textWidth: 170,
				width: 190,
				height: 65,
			});

			data.boxes.push({
				...defaultConfig,
				label: "Government Department",
				x: 240,
				y: 85,
				textWidth: 130,
				width: 150,
				height: 65,
			});

			data.boxes.push({
				...defaultConfig,
				label: "Political Party",
				x: 155,
				y: 40,
				textWidth: 125,
				width: 145,
				height: 35,
			});

			data.boxes.push({
				...defaultConfig,
				label: "Activist",
				x: 55,
				y: 370,
				textWidth: 95,
				width: 100,
				height: 35,
			});

			data.boxes.push({
				...defaultConfig,
				label: "Voter",
				x: 160,
				y: 370,
				textWidth: 95,
				width: 100,
				height: 35,
			});

			data.boxes.push({
				...defaultConfig,
				label: "Citizen",
				x: 265,
				y: 370,
				textWidth: 95,
				width: 100,
				height: 35,
			});

			// Blue connecting lines
			//

			data.lines = [];

			const defaultLineConfig = {
				x: 0,
				y: 0,
				pointerLength: 8,
				pointerWidth: 8,
				pointerAtBeginning: true,
				fill: 'red',
				lineJoin: 'round',
				stroke: 'green',
				strokeWidth: 1,
				dash: [6, 3],
			};

			data.lines.push({
				...defaultLineConfig,
				points: [105, 145, 105, 375],
			});

			return data;
		}

	},

	methods: {
		inArray(arr, item) {
			return (arr.indexOf(item) !== -1);
		}
	}

}
</script>
