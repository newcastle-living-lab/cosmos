<template>

	<aside class="app-sidebar">
		<AspectsView
			v-show="!isEditing"
			:aspectId="aspectId"
		/>
		<EditorView
			v-if="isEditing"
			:aspectId="aspectId"
		/>
	</aside>

</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';

import AspectsView from './AspectsView';
import EditorView from './EditorView';

import Aspects from '@/aspects';

export default {

	components: {
		AspectsView,
		EditorView,
	},

	props: {
		aspectId: String,
	},

	computed: {

		...get([
			'aspectEditId',
		]),

		isEditing() {
			return (this.aspectEditId !== false);
		}

	},

}
</script>
