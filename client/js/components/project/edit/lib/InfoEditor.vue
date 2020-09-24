<template>

	<div class="sidebar-content">

		<VGroup :name="inputId('title')" :label="$t('app.title')">
			<VInput type="text" v-model="val.title" maxlength="255" />
		</VGroup>

		<VGroup :name="inputId('body')" :label="definitionBody.label">
			<span class="form-input-hint" v-if="definitionBody.hint">{{ definitionBody.hint }}</span>
			<VTextarea rows="10" v-model="val.body" />
		</VGroup>

	</div>

</template>

<script>

export default {

	name: "InfoEditor",

	props: {
		aspectId: String,
		definition: Object,
		value: Object,
	},

	computed: {

		val: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("input", value);
			}
		},

		definitionBody() {

			var body = {
				label: this.$t('app.description'),
				hint: false
			};

			const labelKey = `aspects.${this.aspectId}.definitions.${this.definition.id}.body.label`;
			const hintKey = `aspects.${this.aspectId}.definitions.${this.definition.id}.body.hint`;

			if (this.$te(labelKey)) {
				body.label = this.$t(labelKey);
			}

			if (this.$te(hintKey)) {
				body.hint = this.$t(hintKey);
			}

			return body;
		},

	},

	methods: {
		inputId(forInput) {
			return `${this.definition.id}_${forInput}`;
		}
	},

	mounted() {
		this.val = this.value;
	},

}
</script>
