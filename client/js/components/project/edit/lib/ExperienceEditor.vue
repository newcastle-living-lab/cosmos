<template>
	<div>
		<div class="btn-group btn-group-block">
			<label
				class="btn form-radio"
				v-for="option in options"
				:key="option.value"
			>
				<input
					type="radio"
					class="text-hide"
					:value="option.value"
					v-model="val"
				>
				<span>
					<img :src="'/images/aspects/' + option.img" />
				</span>
			</label>
		</div>
		<!-- <VRadio
			v-for="option in options"
			:key="option.value"
			:value="option.value"
			:label="option.label ? option.label : $t(option.lang)"
			v-model="val"
		/> -->
	</div>
</template>

<script>

export default {

	name: "ExperienceEditor",

	props: {
		name: String,
		definition: Object,
		value: [String, Number]
	},

	data() {
		return {
			options: [
				{ value: 'negative', img: 'user-journey/face-frown.svg' },
				{ value: 'neutral', img: 'user-journey/face-neutral.svg' },
				{ value: 'positive', img: 'user-journey/face-smile.svg' },
			]
		};
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

	},
}

</script>

<style lang="scss" scoped>
.btn {

	height: auto;
	padding: 0 2px;
	border: 0;

	img {
		display: block;
		margin: 0 auto;
		width: 64px;
		height: 64px;
	}

	span {
		display: block;
		border: 2px solid transparent;
	}

	input {
		&:checked + span {
			background: #f2f0f1;
			border: 2px solid #003965;
		}
	}

	&:hover,
	&:focus,
	&:active {
		background: transparent;
		span {
			border: 2px solid #ffdc00;
		}
	}
}
</style>
