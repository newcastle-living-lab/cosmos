<template>

	<div :class="showWrapper ? 'sidebar-content' : ''">

		<VGroup :name="inputId('label')" :label="$t('app.label')">
			<VInput ref="label" type="text" :id="inputId('label')" v-model="val.label" maxlength="255" @enter="$emit('enter')" />
		</VGroup>

		<VGroup name="type" :label="$t('app.type')">
			<VRadioList name="type" :options="typeOptions" v-model="val.type" />
		</VGroup>

		<VGroup name="colour" :label="$t('app.colour')">
			<VColourPicker v-model="val.colour" />
		</VGroup>

		<VGroup :name="inputId('url')" :label="$t('app.web_address')">
			<VInput placeholder="https://" type="url" :id="inputId('url')" v-model="val.url" maxlength="255" @enter="$emit('enter')" />
		</VGroup>

	</div>

</template>

<script>

import activityTypes from '@/data/activityTypes.json';

const defaultValue = {
	label: null,
	type: null,
	colour: null,
	url: null,
};

export default {

	name: "StakeholderEditor",

	props: {
		groupName: String,
		definition: Object,
		value: Object,
	},

	mounted() {
		this.val = this.value;
		this.$nextTick(() => {
			this.$refs.label.$el.focus();
		});
	},

	computed: {

		typeOptions() {
			return activityTypes.map((opt) => {
				return {
					value: opt.value,
					label: this.$t(`activity_types.${opt.value}`),
				};
			});
		},

		showWrapper() {
			return this.definition ? true : false
		},

		val: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("input", value);
			}
		}

	},

	methods: {

		inputId(forInput) {
			var prefix = this.definition ? this.definition.id : this.groupName;
			return `${prefix}_${forInput}`;
		},

	}

}
</script>
