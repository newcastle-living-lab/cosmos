<template>

	<v-group>

		<CosmosTitle :aspectId="aspectId" :options="options" />

		<!-- Swim Lanes -->

		<v-group v-for="(stage, idx) in journeyStagesConfig" :key="'stage' + idx" :config="stage.group">
			<v-label :config="stage.label">
				<v-tag :config="stage.tag" />
				<v-text :config="stage.text" />
			</v-label>
		</v-group>

		<v-group :config="{ x: 187, y: 550 }">
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

		<v-group :config="{ x: 490, y: 95, scale: { x: 0.9, y: 0.9 } }">
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
	question: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z',
	cross: 'M6 18L18 6M6 6l12 12',
};

export default {

	name: 'UserJourneyDashboard',

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

				config.designing = (
					this.aspectData.designing.design_input_asked.length
					&& this.aspectData.designing.design_assist_asked.length
				) ? true : false;

				config.instigating = (
					this.aspectData.instigating.identify_role.length
					&& this.aspectData.instigating.design_role.length
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

			const yPos = 500;

			const visibility = this.visibility;

			data.evaluating = {
				group: { visible: visibility.evaluating },
				label: { x: xPos(5), y: yPos, },
				tag: { ...tagConfig, fill: '#604A7B', pointerHeight: 0 },
				text: { ...textConfig, text: this.$t('aspects.user_journey_model.definitions.evaluating.title') },
			};

			data.using = {
				group: { visible: visibility.using },
				label: { x: xPos(4), y: yPos, },
				tag: { ...tagConfig, fill: '#FAC090', },
				text: { ...textConfig, text: this.$t('aspects.user_journey_model.definitions.using.title') },
			};

			data.accessing = {
				group: { visible: visibility.accessing },
				label: { x: xPos(3), y: yPos, },
				tag: { ...tagConfig, fill: '#D99694', },
				text: { ...textConfig, text: this.$t('aspects.user_journey_model.definitions.accessing.title') },
			};

			data.discovering = {
				group: { visible: visibility.discovering },
				label: { x: xPos(2), y: yPos, },
				tag: { ...tagConfig, fill: '#4F81BD', },
				text: { ...textConfig, text: this.$t('aspects.user_journey_model.definitions.discovering.title') },
			};

			data.designing = {
				group: { visible: visibility.designing },
				label: { x: xPos(1), y: yPos, },
				tag: { ...tagConfig, fill: '#79C36F', },
				text: { ...textConfig, text: this.$t('aspects.user_journey_model.definitions.designing.title') },
			};

			data.instigating = {
				group: { visible: visibility.instigating },
				label: { x: xPos(0), y: yPos, },
				tag: { ...tagConfig, fill: '#DC5C52', },
				text: { ...textConfig, text: this.$t('aspects.user_journey_model.definitions.instigating.title') },
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

			const brokerValue = this.aspectData.designing.design_assist_broker;
			if ( ! this.userGuide.isOpen && brokerValue.length) {

				data.push({
					...defaultConfig,
					labelConfig: { fontStyle: 'bold', fontSize: 16 },
					x: -140,
					y: 230,
					label: [
						this.$t('aspects.user_journey_model.definitions.designing.design_assist_broker.hint'),
						""
					].join("\n"),
					textWidth: 240,
					width: 250,
					height: 60,
				});

				data.push({
					...defaultConfig,
					x: -140,
					y: 230,
					label: [
						"",
						this.$t(`aspects.user_journey_model.options.design_assist_broker.${brokerValue}`)
					].join("\n"),
					textWidth: 240,
					width: 250,
					height: 60,
				});

			}

			data.push({
				...defaultConfig,
				visible: visibility.designing,
				label: this.$t('aspects.user_journey_model.dashboard.service_definition'),
				x: 0,
				y: 140,
				textWidth: 105,
				width: 115,
				height: 60,
			});

			data.push({
				...defaultConfig,
				visible: visibility.designing,
				label: this.$t('aspects.user_journey_model.dashboard.service_resourcing'),
				x: 130,
				y: 30,
				textWidth: 125,
				width: 155,
				height: 60,
			});

			data.push({
				...defaultConfig,
				visible: visibility.designing,
				label: this.$t('aspects.user_journey_model.dashboard.reservation_scheduling'),
				x: 305,
				y: 30,
				textWidth: 175,
				width: 185,
				height: 60,
			});

			data.push({
				...defaultConfig,
				visible: visibility.using,
				label: this.$t('aspects.user_journey_model.dashboard.service_delivery'),
				x: 515,
				y: 30,
				textWidth: 100,
				width: 130,
				height: 60,
			});

			data.push({
				...defaultConfig,
				visible: visibility.discovering,
				label: this.$t('aspects.user_journey_model.dashboard.service_publicity'),
				x: 130,
				y: 150,
				textWidth: 135,
				width: 165,
				height: 40,
			});

			data.push({
				...defaultConfig,
				visible: visibility.accessing,
				label: this.$t('aspects.user_journey_model.dashboard.qualifying_agent'),
				x: 315,
				y: 150,
				textWidth: 135,
				width: 165,
				height: 40,
			});

			data.push({
				...defaultConfig,
				visible: visibility.evaluating,
				label: this.$t('aspects.user_journey_model.dashboard.evaluating_agent'),
				x: 700,
				y: 140,
				textWidth: 100,
				width: 125,
				height: 60,
			});

			data.push({
				...defaultConfig,
				visible: visibility.discovering,
				label: this.$t('aspects.user_journey_model.dashboard.potential_beneficiary'),
				x: 125,
				y: 315,
				textWidth: 130,
				width: 165,
				height: 60,
			});

			data.push({
				...defaultConfig,
				visible: visibility.accessing,
				label: this.$t('aspects.user_journey_model.dashboard.applicant'),
				x: 315,
				y: 325,
				textWidth: 130,
				width: 165,
				height: 40,
			});

			data.push({
				...defaultConfig,
				visible: visibility.using,
				label: this.$t('aspects.user_journey_model.dashboard.client'),
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
				text: this.$t('aspects.user_journey_model.dashboard.budget'),
				x: 120,
				y: 100,
			});

			data.push({
				...defaultConfig,
				visible: visibility.designing,
				text: this.$t('aspects.user_journey_model.dashboard.service_definition'),
				x: 265,
				y: 110,
			});

			data.push({
				...defaultConfig,
				visible: visibility.designing,
				text: this.$t('aspects.user_journey_model.dashboard.outcome_reports'),
				x: 715,
				y: 55,
				width: 80,
			});

			data.push({
				...defaultConfig,
				visible: visibility.designing,
				text: this.$t('aspects.user_journey_model.dashboard.provider_views'),
				x: 600,
				y: 145,
				width: 75,
			});

			data.push({
				...defaultConfig,
				visible: visibility.discovering,
				text: this.$t('aspects.user_journey_model.dashboard.service_publication'),
				x: 155,
				y: 235,
				width: 100,
			});

			data.push({
				...defaultConfig,
				visible: visibility.accessing,
				align: 'center',
				text: this.$t('aspects.user_journey_model.dashboard.application'),
				x: 355,
				y: 245,
			});

			data.push({
				...defaultConfig,
				visible: visibility.using,
				text: this.$t('aspects.user_journey_model.dashboard.service_use'),
				x: 525,
				y: 245,
			});

			data.push({
				...defaultConfig,
				visible: visibility.evaluating,
				text: this.$t('aspects.user_journey_model.dashboard.clients_view'),
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
				text: this.$t('aspects.user_journey_model.dashboard.service_instigation_policymaking'),
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
				label: this.$t('aspects.user_journey_model.dashboard.pressure_campaign_group'),
				x: 10,
				y: 85,
				textWidth: 170,
				width: 190,
				height: 65,
			});

			data.boxes.push({
				...defaultConfig,
				label: this.$t('aspects.user_journey_model.dashboard.government_department'),
				x: 240,
				y: 85,
				textWidth: 130,
				width: 150,
				height: 65,
			});

			data.boxes.push({
				...defaultConfig,
				label: this.$t('aspects.user_journey_model.dashboard.political_party'),
				x: 150,
				y: 40,
				textWidth: 125,
				width: 145,
				height: 35,
			});

			data.boxes.push({
				...defaultConfig,
				label: this.$t('aspects.user_journey_model.dashboard.activist'),
				x: 55,
				y: 300,
				textWidth: 95,
				width: 100,
				height: 35,
			});

			data.boxes.push({
				...defaultConfig,
				label: this.$t('aspects.user_journey_model.dashboard.voter'),
				x: 160,
				y: 300,
				textWidth: 95,
				width: 100,
				height: 35,
			});

			data.boxes.push({
				...defaultConfig,
				label: this.$t('aspects.user_journey_model.dashboard.citizen'),
				x: 265,
				y: 300,
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
				end: [105, 300],
			});

			data.connectors.push({
				...defaultConnectorConfig,
				visible: visibility.political,
				start: [220, 75],
				end: [220, 300],
			});

			data.connectors.push({
				...defaultConnectorConfig,
				visible: visibility.government,
				start: [315, 150],
				end: [315, 300],
			});

			return data;
		},

		swimLanesConfig() {

			var lanes = [];

			// Green service experience
			lanes.push({
				x: 0,
				y: 0,
				width: 1080,
				height: 70,
				fill: '#d7e4bd',
			});

			// Yellow carrier of experience

			lanes.push({
				x: 0,
				y: 90,
				width: 1080,
				height: 70,
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

			const xOffset = 520;

			labels.push({
				...defaultLabelConfig,
				text: this.$t('aspects.user_journey_model.dashboard.service_workflow'),
				width: 100,
				align: 'center',
				x: 0,
				y: 0,
				// y: -130,
				offsetX: -250,
				offsetY: 170,
			});

			labels.push({
				...defaultLabelConfig,
				text: this.$t('aspects.user_journey_model.dashboard.touch_points'),
				width: 100,
				align: 'right',
				x: 0,
				y: 0,
				offsetX: (180 * 1) - 20,
				offsetY: 60,
			});

			labels.push({
				...defaultLabelConfig,
				text: this.$t('aspects.user_journey_model.dashboard.service_experience'),
				width: 100,
				align: 'right',
				x: 0,
				y: 0,
				offsetX: (180 * 1) - 20,
				offsetY: -10,
			});

			labels.push({
				...defaultLabelConfig,
				text: this.$t('aspects.user_journey_model.dashboard.carrier_of_experience'),
				width: 100,
				align: 'right',
				x: 0,
				y: 0,
				offsetX: (180 * 1) - 20,
				offsetY: -100,
			});

			// Responses
			//

			const defaultResponseTextConfig = {
				...defaultTextConfig,
				fontStyle: 'normal',
				fontSize: 16,
				align: 'center',
				width: 180,
				padding: 10,
				y: 100,
			};

			// Instigating: Did you play a role in how the service was initally identified?
			//
			var optionValue = this.aspectData.instigating.identify_role;

			var config = {
				...defaultResponseTextConfig,
				visible: (optionValue && optionValue.length ? true : false),
				x: 0 * 180,
			};

			switch (optionValue) {
				case "no":
					config.text = '✗';
					config.fontStyle = 'bold';
					break;
				case "maybe":
					config.text = '?';
					config.fontStyle = 'bold';
					break;
				case "yes":
					var howResponse = this.aspectData.instigating.identify_method;
					var langKey = `aspects.user_journey_model.options.methods.${howResponse}`;
					config.text = this.$te(langKey) ? this.$t(langKey) : this.$t(`aspects.user_journey_model.options.yes_no_maybe.yes`);
					break;
			}

			labels.push(config);


			// Design: Were you asked to input into the design of the service?
			//
			var optionValue = this.aspectData.designing.design_input_asked;

			var config = {
				...defaultResponseTextConfig,
				visible: (optionValue && optionValue.length ? true : false),
				x: 1 * 180,
			};

			switch (optionValue) {
				case "no":
					config.text = '✗';
					config.fontStyle = 'bold';
					break;
				case "maybe":
					config.text = '?';
					config.fontStyle = 'bold';
					break;
				case "yes":
					var howResponse = this.aspectData.designing.design_input_method;
					var langKey = `aspects.user_journey_model.options.methods.${howResponse}`;
					config.text = this.$te(langKey) ? this.$t(langKey) : this.$t(`aspects.user_journey_model.options.yes_no_maybe.yes`);
					break;
			}

			labels.push(config);

			// How did you find out about the service?
			//

			var optionValue = this.aspectData.discovering.discovery_medium;
			var langKey = `aspects.user_journey_model.options.mediums.${optionValue}`;

			labels.push({
				...defaultResponseTextConfig,
				text: this.$te(langKey) ? this.$t(langKey) : '',
				visible: (optionValue && optionValue.length && this.$te(langKey) ? true : false),
				x: 2 * 180,
			});


			// How did you gain access to the service?
			//
			var optionValue = this.aspectData.accessing.access_method;
			var langKey = `aspects.user_journey_model.options.access_methods.${optionValue}`;

			labels.push({
				...defaultResponseTextConfig,
				text: this.$te(langKey) ? this.$t(langKey) : '',
				visible: (optionValue && optionValue.length && this.$te(langKey) ? true : false),
				x: 3 * 180,
			});

			// Where did you use the service?
			//
			var optionValue = this.aspectData.using.where;
			var langKey = `aspects.user_journey_model.options.where.${optionValue}`;

			labels.push({
				...defaultResponseTextConfig,
				text: this.$te(langKey) ? this.$t(langKey) : '',
				visible: (optionValue && optionValue.length && this.$te(langKey) ? true : false),
				x: 4 * 180,
			});

			// Were you asked about your opinions about your experience of the service?
			//
			var optionValue = this.aspectData.evaluating.opinions_asked;

			var config = {
				...defaultResponseTextConfig,
				visible: (optionValue && optionValue.length ? true : false),
				x: 5 * 180,
			};


			switch (optionValue) {
				case "no":
					config.text = '✗';
					config.fontStyle = 'bold';
					break;
				case "maybe":
					config.text = '?';
					config.fontStyle = 'bold';
					break;
				case "yes":
					var howResponse = this.aspectData.evaluating.opinions_how;
					var langKey = `aspects.user_journey_model.options.opinions_how.${howResponse}`;
					config.text = this.$te(langKey) ? this.$t(langKey) : this.$t(`aspects.user_journey_model.options.yes_no_maybe.yes`);
					break;
			}

			labels.push(config);

			return labels;
		},

		swimLaneSmileys() {

			var faces = [];

			const defaultFaceConfig = {
				opacity: 1,
				scale: { x: 0.35, y: 0.35 },
				x: 0,
				y: 10,
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
				designing: this.aspectData.designing.design_input_experience,
				instigating: this.aspectData.instigating.identify_experience,
			};

			var offset = 65;
			faces.push({
				...defaultFaceConfig,
				visible: (responses.instigating.length ? true : false),
				filename: faceTypes[responses.instigating],
				x: offset,
			});

			offset += 180;
			faces.push({
				...defaultFaceConfig,
				visible: (responses.designing.length ? true : false),
				filename: faceTypes[responses.designing],
				x: offset,
			});

			offset += 180;
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
