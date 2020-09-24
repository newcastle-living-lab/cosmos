<template>

	<div class="sidebar-content">

		<VGroup name="name" :label="$t('app.name')">
			<VInput type="text" id="name" v-model="value.name" maxlength="255" />
		</VGroup>

		<VGroup name="created_by" :label="$t('app.created_by')">
			<VInput type="text" id="created_by" v-model="value.created_by" maxlength="255" />
		</VGroup>
	</div>

</template>

<script>

export default {

	name: "MetaEditor",
	props: ['value'],

}
</script>
