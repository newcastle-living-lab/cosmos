<template>

	<div class="sidebar-content">
		<VGroup name="countries" :label="$t('app.which_country')">
			<VRadioList :options="availableCountries" v-model="val" />
		</VGroup>
	</div>

</template>

<script>

import map from 'lodash/map';

import Trans from '@/services/Trans';

export default {

	name: "ProjectCountryEditor",

	props: {
		value: String,
	},

	mounted() {
		this.val = this.value;
	},

	computed: {

		availableCountries() {

			return map(Trans.supportedLanguages(), (lang) => {
				return {
					value: lang,
					label: this.$t(`countries.${lang}`),
				};
			});

		},

		val: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("input", value);
			}
		}
	}
}
</script>
