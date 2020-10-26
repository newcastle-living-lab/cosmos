<template>

	<div class="sidebar-content">
		<VGroup name="models" :label="$t('app.models')">
			<VCheckList :options="availableModels" v-model="val" />
		</VGroup>
	</div>

</template>

<script>

export default {

	name: "ProjectModelsEditor",

	props: {
		value: Array,
	},

	mounted() {
		this.val = this.value;
	},

	computed: {

		availableModels() {
			return [
				{ value: "analytic_model", label: this.$t(`aspects.analytic_model.title`) },
				{ value: "change_model", label: this.$t(`aspects.change_model.title`) },
				{ value: "intervention_theory_model", label: this.$t(`aspects.intervention_theory_model.title`) },
				{ value: "moral_ordering_model", label: this.$t(`aspects.moral_ordering_model.title`) },
				{ value: "co_creation_of_service_model", label: this.$t(`aspects.co_creation_of_service_model.title`) },
			];
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
