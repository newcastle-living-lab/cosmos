<template>

	<main ref="container" class="app-content light welcome">

		<div class="container grid-xl mb-8">
			<h1 class="h5 mb-2">{{ project.name }}</h1>
			<p v-if="project.created_by">
				{{ $t('aspects.welcome.dashboard.summary', { user: project.created_by, date_time: project.created_at }) }}
			</p>
		</div>

		<div class="container grid-xl">
			<LifecycleMenu />
		</div>

	</main>

</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';

import LifecycleMenu from '@/components/LifecycleMenu';

export default {

	components: {
		LifecycleMenu
	},

	computed: {
		...get([
			'project',
		]),
	}

}

</script>
