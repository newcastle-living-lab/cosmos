<template>

	<v-group>

		<CosmosTitle :aspectId="aspectId" :options="options" />

		<!-- Swim Lanes -->
		<v-group :config="{ x: 547, y: 430 }">
			<v-rect
				v-for="(rect, idx) in swimLanesConfig"
				:key="'swimLane' + idx"
				:config="rect"
			/>
			<v-text
				v-for="(label, idx) in swimLaneLabelsConfig"
				:key="'swimLaneLabel' + idx"
				:config="label"
			/>
			<CosmosImage
				v-for="(img, idx) in swimLaneSmileys"
				:key="'swimLaneSmiley' + idx"
				:config="img"
			/>
		</v-group>

		<v-group v-for="(stage, idx) in journeyStagesConfig" :key="'stage' + idx" :config="stage.group">
			<v-label :config="stage.label">
				<v-tag :config="stage.tag" />
				<v-text :config="stage.text" />
			</v-label>
		</v-group>

		<v-group :config="{ x: 490, y: 85, scale: { x: 0.85, y: 0.85 } }">
			<v-group v-for="(text, idx) in flowchartTextConfig" :key="'flowText' + idx" :config="{ x: 0, y: 0 }">
				<CosmosTextBox :options="options" :config="text" />
			</v-group>

			<v-group v-for="(text, idx) in flowchartLabelsConfig" :key="'flowLabel' + idx" :config="{ x: 0, y: 0 }">
				<v-text :config="text" />
			</v-group>

			<v-group v-for="(arrow, idx) in flowchartArrowsConfig" :key="'flowArrow' + idx" :config="{ x: 0, y: 0 }">
				<v-arrow :config="arrow" />
			</v-group>
		</v-group>

		<v-group :config="sipConfig.group">
			<v-rect :config="sipConfig.rect" />
			<v-text :config="sipConfig.label" />
			<CosmosTextBox
				v-for="(text, idx) in sipConfig.boxes"
				:key="'sipBox' + idx"
				:config="text"
				:options="options"
			/>
			<CosmosConnector
				v-for="(conn, idx) in sipConfig.connectors"
				:key="'sipConnector' + idx"
				:config="conn"
			/>
		</v-group>

	</v-group>

</template>

<script>

import { get } from 'vuex-pathify';
import map from 'lodash/map';
import find from 'lodash/find';
import filter from 'lodash/filter';

import colours from 'colors.css';

const defaultTextConfig = {
	fontSize: 24,
	fontStyle: 'bold',
	fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
	lineHeight: 1.2,
	align: 'center'
};

const Icons = {
	check: 'M5 13l4 4L19 7',
	cross: 'M6 18L18 6M6 6l12 12',
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

		visibility() {

			var config = {
				discovering: false,
				accessing: false,
				using: false,
				evaluating: false,
				designing: false,
				instigating: false,
				pressureGroup: false,
				political: false,
				government: false,
			};

			if (this.userGuide.isOpen) {

				config.discovering = (this.userGuide.currentStep >= 0 ? true : false);
				config.accessing = (this.userGuide.currentStep >= 1 ? true : false);
				config.using = (this.userGuide.currentStep >= 2 ? true : false);
				config.evaluating = (this.userGuide.currentStep >= 3 ? true : false);
				config.designing = (this.userGuide.currentStep >= 5 ? true : false);
				config.instigating = (this.userGuide.currentStep >= 6 ? true : false);
				config.pressureGroup = true;
				config.political = true;
				config.government = true;

			} else {

				config.discovering = (
					this.aspectData.discovering.discovery_medium.length
					&& this.aspectData.discovering.information_medium.length
					&& this.aspectData.discovering.information_experience.length
					&& this.aspectData.discovering.comments.length
				) ? true : false;

				config.accessing = (
					this.aspectData.accessing.access_method.length
					&& this.aspectData.accessing.qualification_process.length
					&& this.aspectData.accessing.appropriate_comment.length
				) ? true : false;

				config.using = (
					this.aspectData.using.participate_experience.length
					&& this.aspectData.using.accessible_experience.length
					&& this.aspectData.using.time_experience.length
				) ? true : false;

				config.evaluating = (
					this.aspectData.evaluating.opinions_asked.length
					&& this.aspectData.evaluating.service_experience.length
					&& this.aspectData.evaluating.surprises_comments.length
				) ? true : false;

				config.designing = config.evaluating;

				config.instigating = (
					this.aspectData.instigating.design_role.length
					&& this.aspectData.instigating.comments.length
				) ? true : false;

				config.pressureGroup = this.inArray(this.aspectData.instigating.instigate_role, 'pressure_group');
				config.political = this.inArray(this.aspectData.instigating.instigate_role, 'political_party');
				config.government = this.inArray(this.aspectData.instigating.instigate_role, 'government_department');

			}

			return config;

		},

		bgConfig() {

			var data = {};

			return data;
		},

		serviceLabelConfig() {
			return {
				...defaultTextConfig,
				visible: (this.visibility.designing || this.visibility.instigating),
				fontStyle: 'italic',
				fontSize: 18,
				text: 'Service Co-creation Journey',
				width: 175,
				align: 'right',
				x: 0,
				y: 535,
			}
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

			const visibility = this.visibility;

			data.evaluating = {
				group: { visible: visibility.evaluating },
				label: { x: xPos(5), y: yPos, },
				tag: { ...tagConfig, fill: '#604A7B', pointerHeight: 0 },
				text: { ...textConfig, text: 'Evaluating' },
			};

			data.using = {
				group: { visible: visibility.using },
				label: { x: xPos(4), y: yPos, },
				tag: { ...tagConfig, fill: '#FAC090', },
				text: { ...textConfig, text: 'Using' },
			};

			data.accessing = {
				group: { visible: visibility.accessing },
				label: { x: xPos(3), y: yPos, },
				tag: { ...tagConfig, fill: '#D99694', },
				text: { ...textConfig, text: 'Accessing' },
			};

			data.discovering = {
				group: { visible: visibility.discovering },
				label: { x: xPos(2), y: yPos, },
				tag: { ...tagConfig, fill: '#4F81BD', },
				text: { ...textConfig, text: 'Discovering' },
			};

			data.designing = {
				group: { visible: visibility.designing },
				label: { x: xPos(1), y: yPos, },
				tag: { ...tagConfig, fill: '#79C36F', },
				text: { ...textConfig, text: 'Designing' },
			};

			data.instigating = {
				group: { visible: visibility.instigating },
				label: { x: xPos(0), y: yPos, },
				tag: { ...tagConfig, fill: '#DC5C52', },
				text: { ...textConfig, text: 'Instigating' },
			};

			return data;
		},

		flowchartTextConfig() {

			const visibility = this.visibility;

			var data = [];

			const defaultConfig = {
				labelConfig: { fontStyle: 'normal', fontSize: 16 },
				borderConfig: { cornerRadius: 0, strokeWidth: 2 },
			};

			data.push({
				...defaultConfig,
				visible: visibility.designing,
				label: "Service Definition",
				x: 0,
				y: 140,
				textWidth: 105,
				width: 115,
				height: 60,
			});

			data.push({
				...defaultConfig,
				visible: visibility.designing,
				label: "Service Resourcing",
				x: 130,
				y: 30,
				textWidth: 125,
				width: 155,
				height: 60,
			});

			data.push({
				...defaultConfig,
				visible: visibility.designing,
				label: "Reservation & Scheduling",
				x: 305,
				y: 30,
				textWidth: 175,
				width: 185,
				height: 60,
			});

			data.push({
				...defaultConfig,
				visible: visibility.using,
				label: "Service Delivery",
				x: 515,
				y: 30,
				textWidth: 100,
				width: 130,
				height: 60,
			});

			data.push({
				...defaultConfig,
				visible: visibility.discovering,
				label: "Service Publicity",
				x: 130,
				y: 150,
				textWidth: 135,
				width: 165,
				height: 40,
			});

			data.push({
				...defaultConfig,
				visible: visibility.accessing,
				label: "Qualifying Agent",
				x: 315,
				y: 150,
				textWidth: 135,
				width: 165,
				height: 40,
			});

			data.push({
				...defaultConfig,
				visible: visibility.evaluating,
				label: "Evaluating Agent",
				x: 700,
				y: 140,
				textWidth: 100,
				width: 125,
				height: 60,
			});

			data.push({
				...defaultConfig,
				visible: visibility.discovering,
				label: "Potential Beneficiary",
				x: 125,
				y: 315,
				textWidth: 130,
				width: 165,
				height: 60,
			});

			data.push({
				...defaultConfig,
				visible: visibility.accessing,
				label: "Applicant",
				x: 315,
				y: 325,
				textWidth: 130,
				width: 165,
				height: 40,
			});

			data.push({
				...defaultConfig,
				visible: visibility.using,
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

			const visibility = this.visibility;

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
				visible: visibility.designing,
				text: 'Budget',
				x: 120,
				y: 100,
			});

			data.push({
				...defaultConfig,
				visible: visibility.designing,
				text: 'Service Definition',
				x: 265,
				y: 110,
			});

			data.push({
				...defaultConfig,
				visible: visibility.designing,
				text: 'Outcome Reports',
				x: 715,
				y: 55,
				width: 80,
			});

			data.push({
				...defaultConfig,
				visible: visibility.designing,
				text: 'Provider views',
				x: 600,
				y: 145,
				width: 75,
			});

			data.push({
				...defaultConfig,
				visible: visibility.discovering,
				text: 'Service publication',
				x: 155,
				y: 235,
				width: 100,
			});

			data.push({
				...defaultConfig,
				visible: visibility.accessing,
				align: 'center',
				text: 'Application',
				x: 355,
				y: 245,
			});

			data.push({
				...defaultConfig,
				visible: visibility.using,
				text: 'Service Use',
				x: 525,
				y: 245,
			});

			data.push({
				...defaultConfig,
				visible: visibility.evaluating,
				text: 'Clients\' views',
				x: 715,
				y: 235,
				width: 90,
			});

			return data;
		},

		flowchartArrowsConfig() {

			const visibility = this.visibility;

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
			data.push({ ...defaultConfig, visible: visibility.designing, points: [ 85, 130, 115, 110] });

			// Service Definition -> Service Definition
			data.push({ ...defaultConfig, visible: visibility.designing, points: [ 120, 135, 245, 120] });

			// Service Definition -> Service Publicity
			data.push({ ...defaultConfig, visible: visibility.designing, points: [ 275, 130, 275, 145] });

			// Service Definition -> Qualifying
			data.push({ ...defaultConfig, visible: visibility.designing, points: [ 370, 130, 370, 145] });

			// Service Definition -> Service Delivery
			data.push({
				...defaultConfig,
				visible: visibility.designing,
				tension: 0.6,
				points: [
					430, 120,
					525, 115,
					565, 100
				]
			});

			// Service Delivery -> Service Use
			data.push({ ...defaultConfig, visible: visibility.using, points: [ 570, 100, 570, 240] });

			// Service Delivery -> Provider Views
			data.push({
				...defaultConfig,
				visible: visibility.designing,
				tension: 0.6,
				points: [
					575, 100,
					585, 140,
					600, 155
				]
			});

			// Provider views -> Evaluating Agent
			data.push({ ...defaultConfig, visible: visibility.designing, points: [ 675, 165, 695, 165] });

			// Evaluating Agent -> Outcome reports
			data.push({ ...defaultConfig, visible: visibility.designing, points: [ 755, 130, 755, 105] });

			// Clients views -> Evaluating Agent
			data.push({ ...defaultConfig, visible: visibility.evaluating, points: [ 755, 230, 755, 210] });

			// Client -> Clients Views
			data.push({
				...defaultConfig,
				visible: visibility.evaluating,
				tension: 0.3,
				points: [
					660, 350,
					715, 350,
					755, 325,
					760, 285
				]
			});

			// Service Publicity -> Service publication
			data.push({ ...defaultConfig, visible: visibility.discovering, points: [ 205, 195, 205, 230] });

			// Service publication -> Potential Beneficiary
			data.push({ ...defaultConfig, visible: visibility.discovering, points: [ 205, 280, 205, 305] });

			// Applicant -> Application
			data.push({ ...defaultConfig, visible: visibility.accessing, points: [ 390, 315, 390, 275] });

			// Application -> Qualifying Agent
			data.push({ ...defaultConfig, visible: visibility.accessing, points: [ 390, 240, 390, 205] });

			// Service Use -> Client
			data.push({ ...defaultConfig, visible: visibility.using, points: [ 570, 275, 570, 315] });

			// Outcome reports -> Service definition
			data.push({
				...defaultConfig,
				visible: visibility.designing,
				tension: 0.4,
				points: [
					755, 45,
					745, 20,
					700, 0,
					105, 0,
					75, 130,
				]
			});

			// Arrows from initial screen
			//

			// Service Publication -> Application
			// data.push({ ...defaultConfig, points: [ 265, 255, 330, 255] });

			// Application -> Service Use
			// data.push({ ...defaultConfig, points: [ 455, 255, 510, 255] });

			return data;
		},

		sipConfig() {

			const visibility = this.visibility;

			var data = {};

			data.group = {
			 	x: 20,
			 	y: 85,
			 	visible: visibility.instigating,
			};

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
				x: 150,
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

			data.connectors = [];

			const defaultConnectorConfig = {
				colour: '#4a7ebb',
				radius: 6,
				strokeWidth: 2,
				dash: [6, 3],
			};

			data.connectors.push({
				...defaultConnectorConfig,
				visible: visibility.pressureGroup,
				start: [105, 150],
				end: [105, 370],
			});

			data.connectors.push({
				...defaultConnectorConfig,
				visible: visibility.political,
				start: [220, 75],
				end: [220, 370],
			});

			data.connectors.push({
				...defaultConnectorConfig,
				visible: visibility.government,
				start: [315, 150],
				end: [315, 370],
			});

			return data;
		},

		swimLanesConfig() {

			var lanes = [];

			lanes.push({
				x: 0,
				y: 0,
				width: 720,
				height: 90,
				fill: '#edfdfb',
			});

			lanes.push({
				x: 0,
				y: 160,
				width: 720,
				height: 65,
				fill: '#d7e4bd',
			});

			lanes.push({
				x: 0,
				y: 230,
				width: 720,
				height: 65,
				fill: '#ffe07d',
			});

			return lanes;
		},

		swimLaneLabelsConfig() {

			var labels = [];

			const defaultLabelConfig = {
				...defaultTextConfig,
				fontStyle: 'italic',
				fontSize: 18,
			};

			const defaultValueConfig = {
				...defaultTextConfig,
				fontStyle: 'normal',
				fontSize: 18,
			};

			const xOffset = 520;

			labels.push({
				...defaultLabelConfig,
				text: 'Service Workflow',
				width: 100,
				align: 'right',
				x: 0,
				y: -130,
				offsetX: 110,
			});

			labels.push({
				...defaultLabelConfig,
				text: 'Touch Points',
				width: 100,
				align: 'right',
				x: 0,
				y: 30,
				offsetX: 110,
			});

			labels.push({
				...defaultLabelConfig,
				text: 'Service User Journey',
				width: 100,
				align: 'right',
				x: 0,
				y: 105,
				offsetX: xOffset,
			});

			labels.push({
				...defaultLabelConfig,
				text: 'Service Experience',
				width: 100,
				align: 'right',
				x: 0,
				y: 175,
				offsetX: xOffset,
			});

			labels.push({
				...defaultLabelConfig,
				text: 'Carrier of Experience',
				width: 100,
				align: 'right',
				x: 0,
				y: 245,
				offsetX: xOffset,
			});

			// How did you find out about the service?
			//

			var optionValue = this.aspectData.discovering.discovery_medium;
			var langKey = `aspects.user_journey_model.options.mediums.${optionValue}`;

			labels.push({
				...defaultValueConfig,
				text: this.$te(langKey) ? this.$t(langKey) : '',
				visible: (optionValue && optionValue.length && this.$te(langKey) ? true : false),
				align: 'left',
				x: 10,
				y: 250,
				// offset: 0,
			});

			// How did you gain access to the service?
			//

			var optionValue = this.aspectData.accessing.access_method;
			var langKey = `aspects.user_journey_model.options.access_methods.${optionValue}`;

			labels.push({
				...defaultValueConfig,
				text: this.$te(langKey) ? this.$t(langKey) : '',
				visible: (optionValue && optionValue.length && this.$te(langKey) ? true : false),
				align: 'left',
				x: 220,
				y: 250,
				// offset: 0,
			});

			// Where did you use the service?
			//

			var optionValue = this.aspectData.using.where;
			var langKey = `aspects.user_journey_model.options.where.${optionValue}`;

			labels.push({
				...defaultValueConfig,
				text: this.$te(langKey) ? this.$t(langKey) : '',
				visible: (optionValue && optionValue.length && this.$te(langKey) ? true : false),
				align: 'left',
				x: 400,
				y: 250,
				// offset: 0,
			});

			return labels;
		},

		swimLaneSmileys() {

			var faces = [];

			const defaultFaceConfig = {
				opacity: 1,
				scale: { x: 0.35, y: 0.35 },
				x: 0,
				y: 168,
			};

			const faceTypes = {
				'negative': 'user-journey/face-frown.svg',
				'neutral': 'user-journey/face-neutral.svg',
				'positive': 'user-journey/face-smile.svg',
			};

			if ( ! this.aspectData) {
				return faces;
			}

			const responses = {
				discovering: this.aspectData.discovering.information_experience,
				accessing: this.aspectData.accessing.qualification_experience,
				using: this.aspectData.using.participate_experience,
				evaluating: this.aspectData.evaluating.service_experience,
			};

			var offset = 65;
			faces.push({
				...defaultFaceConfig,
				visible: (responses.discovering.length ? true : false),
				filename: faceTypes[responses.discovering],
				x: offset,
			});

			offset += 180;
			faces.push({
				...defaultFaceConfig,
				visible: (responses.accessing.length ? true : false),
				filename: faceTypes[responses.accessing],
				x: offset,
			});

			offset += 180;
			faces.push({
				...defaultFaceConfig,
				visible: (responses.using.length ? true : false),
				filename: faceTypes[responses.using],
				x: offset,
			});

			offset += 180;
			faces.push({
				...defaultFaceConfig,
				visible: (responses.evaluating.length ? true : false),
				filename: faceTypes[responses.evaluating],
				x: offset,
			});

			return faces;
		}

	},

	methods: {
		inArray(arr, item) {
			return (arr.indexOf(item) !== -1);
		}
	}

}
</script>
