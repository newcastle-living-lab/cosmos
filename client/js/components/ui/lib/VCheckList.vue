<template>
	<div>
		<label
			class="form-checkbox"
			v-for="option in options"
			:key="option.value"
		>
			<input
				type="checkbox"
				:value="option.value"
				v-model="val"
			>
			<i class="form-icon"></i>
			<template v-if="option.label">{{ option.label }}</template>
			<template v-else-if="option.lang">{{ $t(option.lang) }}</template>
		</label>
	</div>
</template>

<script>

export default {

	name: "VCheckList",

	props: {
		definition: Object,
		options: Array,
		name: String,
		value: Array,
	},

	computed: {

		val: {
			get() {
				return this.value;
			},
			set(content) {
				this.$emit("input", content);
			}
		}

	}
}

</script>
