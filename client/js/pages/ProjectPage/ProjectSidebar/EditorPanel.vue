<template>

	<div class="sidebar-item" :class="'sidebar-item-type-' + (definition.type ? definition.type : 'general')">

		<h3 @click="setCurrent()" class="sidebar-heading" :class="{ 'clickable': definition.type !== 'divider' }">{{ panelTitle }}</h3>

		<div class="sidebar-main" v-if="isVisible && definition.type !== 'divider'">

			<div class="sidebar-hint" v-if="hint">
				<info-icon size="16" />
				{{ hint }}
			</div>

			<component
				v-bind:is="componentName"
				v-model="model"
				:aspectId="this.panel.aspectId"
				:definition="definition"
				:projectId="project.id"
			></component>

			<div class="sidebar-footer">
				<VButton @click="goNext()" v-if="hasNext" class="btn btn-success btn-block">{{ $t('app.next') }} <i class="icon icon-arrow-down"></i></VButton>
			</div>
		</div>

	</div>

</template>

<script>

import Vue from 'vue';
import { get, set, sync, call } from 'vuex-pathify';
import InfoIcon from 'vue-feather-icons/icons/InfoIcon';

export default {

	components: {
		InfoIcon
	},

	props: {
		currentPanel: String,
		panel: Object,
		hasNext: Boolean,
	},

	computed: {

		...get([
			'project',
		]),

		modelPath() {
			return this.panel.modelPath;
		},

		model: sync(':modelPath'),

		definition() {
			return this.panel && this.panel.definition ? this.panel.definition : false;
		},

		isVisible() {
			return (this.currentPanel == this.panel.id);
		},

		componentName() {
			return this.panel.editor;
		},

		panelTitle() {
			if (this.panel.title) {
				return this.$t(this.panel.title);
			}
			const titleKey = `aspects.${this.panel.aspectId}.definitions.${this.definition.id}.title`;
			if (this.$te(titleKey)) {
				return this.$t(titleKey);
			}
			return this.panel.title ? this.panel.title : this.definition.title
		},

		hint() {
			const hintKey = `aspects.${this.panel.aspectId}.definitions.${this.definition.id}.hint`;
			if (this.$te(hintKey)) {
				return this.$t(hintKey);
			}
			return this.definition && this.definition.hint ? this.definition.hint : false;
		}
	},

	methods: {
		setCurrent() {
			this.$emit('set-current', this.panel.id);
		},
		goNext() {
			this.$emit('go-next', this.panel.id);
		}
	}

}

</script>
