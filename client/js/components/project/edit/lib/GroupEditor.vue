<template>

	<div class="sidebar-content">

		<VGroup
			v-for="(child, idx) in definition.children"
			:key="idx"
			:val="val"
			:label="groupLabel(definition, child)"
			:hint="groupHint(definition, child)"
		>

			<component
				v-bind:is="child.componentName"
				v-model="val[child.id]"
				v-bind="child.componentProps"
				:definition="child"
			></component>

		</VGroup>

	</div>

</template>

<script>

export default {

	name: "GroupEditor",

	props: {
		aspectId: String,
		definition: Object,
		value: Object,
	},

	mounted() {
		this.val = this.value;
	},

	computed: {
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

		groupLabel(definition, child) {
			const langKey = `aspects.${this.aspectId}.definitions.${definition.id}.${child.id}.label`;
			return this.$te(langKey) ? this.$t(langKey) : `[${langKey}]`;
		},

		groupHint(definition, child) {
			const langKey = `aspects.${this.aspectId}.definitions.${definition.id}.${child.id}.hint`;
			return this.$te(langKey) ? this.$t(langKey) : false;
		}

	}

}
</script>
