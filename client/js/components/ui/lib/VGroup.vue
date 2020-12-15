<template>
	<div class="form-group">
		<label class="form-label" :class="labelClass" :for="name">{{ label }}</label>
		<span class="form-input-hint" v-if="hint">{{ hint }}</span>
		<slot />
	</div>
</template>

<script>
export default {
	name: "VGroup",
	props: {
		'hint': String,
		'val': [String,Object,Array],
		'name': String,
		'label': String,
		'labelClass': String,
	}
};
</script>
