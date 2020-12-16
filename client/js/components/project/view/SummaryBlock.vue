<template>

	<div>
		<div class="divider"></div>

		<div class="columns">
			<div class="column col-3">
				<h2 class="group-title">{{ title }}</h2>
			</div>
			<div class="column col-9">
				<table class="table">
					<tbody>
						<slot></slot>
					</tbody>
				</table>
			</div>
		</div>
	</div>


</template>

<script>

export default {

	props: {
		title: String,
	},

}
</script>
