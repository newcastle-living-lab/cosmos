<template>

	<v-group>

		<CosmosTitle :aspectId="aspectId" :options="options" />

		<CosmosInfoBox
			definitionName="drivers"
			:config="{x: 20, y: 100}"
			:options="options"
			:aspectId="this.aspectId"
		/>

		<CosmosExternals
			definitionName="extorg"
			:config="{ x: 20, y: 250, itemColour: '#f012be' }"
			:options="options"
			:aspectId="this.aspectId"
		/>

		<CosmosExternals
			definitionName="extsvc"
			:config="{ x: 20, y: 740, itemColour: '#2ecc40' }"
			:options="options"
			:aspectId="this.aspectId"
		/>

		<CosmosExternals
			definitionName="infsvc"
			:config="{ x: 980, y: 740, itemColour: '#2ecc40' }"
			:options="options"
			:aspectId="this.aspectId"
		/>

		<CosmosCurve :config="{
			x: 480,
			y: 580,
			ratio: 0.1,
			points: {
				start: { x: 0, y: 0 },
				end: { x: 150, y: -360 }
			}
		}" />

		<v-text :config="textsConfig.structural" />

		<CosmosCurve :config="{
			x: 480,
			y: 610,
			ratio: 0.1,
			points: {
				start: { x: 0, y: 0 },
				end: { x: 150, y: 360 }
			}
		}" />

		<v-text :config="textsConfig.infrastructural" />

		<!-- Stakeholders (LEFT) for above serv def + dev platform -->
		<v-group :config="{ x: 620, y: 220 }">
			<CosmosStakeholder
				definitionName="policyDef"
				:aspectId="aspectId"
				:options="options"
				:config="{ group: { x: 100, y: 10 } }"
			/>
			<CosmosStakeholder
				definitionName="specDes"
				:aspectId="aspectId"
				:options="options"
				:config="{ group: { x: 0, y: 160 } }"
			/>
			<CosmosStakeholder
				definitionName="deployment"
				:aspectId="aspectId"
				:options="options"
				:config="{ group: { x: 200, y: 160 } }"
			/>
		</v-group>

		<CosmosArrow :options="options" :config="arrowsConfig.ethos" />
		<CosmosArrow :options="options" :config="arrowsConfig.policy" />
		<CosmosArrow :options="options" :config="arrowsConfig.resources" />

		<CosmosTextBox :options="options" :config="textBoxesConfig.service_definition" />
		<CosmosTextBox :options="options" :config="textBoxesConfig.service_delivery" />

		<v-line :config="{
			x: 990,
			y: 620,
			points: [0, 0, 0, -400],
			stroke: '#3d9970',
			strokeWidth: 2,
			dash: [9, 3]
		}" />

		<v-rect :config="{
			x: 345,
			y: 490,
			width: 160,
			height: 210,
			stroke: '#3d9970',
			cornerRadius: 75,
			strokeWidth: 2,
			fill: '#ffffff'
		}" />

		<CosmosStakeholder
			definitionName="initiator"
			:aspectId="aspectId"
			:options="options"
			:config="{ group: { x: 375, y: 530 } }"
		/>

		<!-- Stakeholders (RIGHT) for above serv del platform -->
		<v-group :config="{ x: 1060, y: 220 }">
			<CosmosStakeholder
				definitionName="delivery"
				:aspectId="aspectId"
				:options="options"
				:config="{ group: { x: 0, y: 10 } }"
			/>
			<CosmosStakeholder
				definitionName="user"
				:aspectId="aspectId"
				:options="options"
				:config="{ group: { x: 200, y: 10 } }"
			/>
			<CosmosStakeholder
				definitionName="evaluation"
				:aspectId="aspectId"
				:options="options"
				:config="{ group: { x: 0, y: 160 } }"
			/>
			<CosmosStakeholder
				definitionName="beneficiary"
				:aspectId="aspectId"
				:options="options"
				:config="{ group: { x: 200, y: 160 } }"
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

	name: 'ServiceDashboard',

	props: {
		aspectId: [Boolean, String],
		options: Object,
		definitions: [Object, Array],
	},

	computed: {

		dataPath() {
			return `project@data.${this.aspectId}`;
		},

		aspectData: get(':dataPath'),

		textsConfig() {

			var data = {};


			const defaults = {
				...defaultTextConfig,
				fontSize: 16,
			};


			data.structural = {
				...defaults,
				x: 600,
				y: 190,
				align: "left",
				text: this.$t('aspects.co_creation_of_service_model.dashboard.structural_relationships'),
				fill: "#ff4136",
				fontSize: 16,
			};

			data.infrastructural = {
				...defaults,
				x: 600,
				y: 980,
				align: "left",
				text: this.$t('aspects.co_creation_of_service_model.dashboard.infrastructural_relationships'),
				fill: "#ff4136",
				fontSize: 16,
			};

			return data;
		},

		arrowsConfig() {

			var data = {};

			data.ethos = {
				x: 330,
				y: 580,
				length: 100,
				direction: "SE",
				arrowColour: "#3d9970",
				label: {
					text: this.$t('aspects.co_creation_of_service_model.dashboard.ethos'),
					fontSize: 18,
					fill: "#3d9970"
				}
			};

			data.policy = {
				x: 330,
				y: 600,
				length: 70,
				direction: "E",
				arrowColour: "#aaaaaa",
				label: {
					text: this.$t('aspects.co_creation_of_service_model.dashboard.policy_law'),
					fontSize: 18,
					fill: "#000000"
				}
			};

			data.resources = {
				x: 330,
				y: 620,
				length: 100,
				direction: "NE",
				arrowColour: "#aaaaaa",
				label: {
					text: this.$t('aspects.co_creation_of_service_model.dashboard.resources'),
					fontSize: 18,
					fill: "#000000"
				}
			};

			return data;
		},

		textBoxesConfig() {

			var data = {};

			data.service_definition = {
				label: this.$t('aspects.co_creation_of_service_model.dashboard.service_definition'),
				x: 500,
				y: 570,
				textWidth: 300,
				width: 500,
				height: 50
			};

			data.service_delivery = {
				label: this.$t('aspects.co_creation_of_service_model.dashboard.service_delivery'),
				x: 980,
				y: 570,
				textWidth: 300,
				width: 500,
				height: 50
			};

			return data;
		}

	},

}
</script>
