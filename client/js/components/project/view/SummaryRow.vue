<template>

	<tr>
		<td class="group-prompt">{{ $t(labelKey) }}</td>
		<td class="group-value" :class="{ 'like-pre': response ? true : false }">

			<template v-if="valueKey">
				<span v-if="response">{{ $t(valueKey) }}</span>
			</template>

			<template v-if="!valueKey">
				<span v-if="response && linkify" v-linkify="response" />
				<span v-if="response && ! linkify">{{ response }}</span>
			</template>

			<slot></slot>
		</td>
	</tr>

</template>

<script>

import { linkify } from '@/plugins/linkify';

export default {

	props: {
		response: [String, Number, Array, Object],
		labelKey: String,
		valueKey: String,
		linkify: Boolean,
	},


	directives: {
		linkify
	},

}
</script>
