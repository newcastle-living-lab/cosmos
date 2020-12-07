<template>

	<div class="annotation-container" v-if="annotation" :class="containerClass" :style="containerStyle">
		<div class="card card-annotation">
			<div class="card-header">
				<button class="btn btn-clear float-right" aria-label="Close" @click="doOK"></button>
				<div class="card-title h5">{{ $t('app.annotation') }}</div>
			</div>
			<div class="card-body" v-if="userCanEdit">
				<VGroup name="annotation">
					<VTextarea rows="6" id="annotation" class="input-sm" v-model="annotation.body" ref="body" />
				</VGroup>
			</div>
			<div class="card-body" v-if="!userCanEdit">
				<div class="text-small like-pre" v-linkify="annotation.body" />
			</div>
			<div class="card-footer">
					<button
						type="button"
						class="btn btn-sm btn-primary"
						@click="doOK"
					><i class="icon icon-check"></i> {{ $t('app.ok') }}</button>
					<button
						type="button"
						class="btn btn-sm btn-negative btn-action float-right tooltip"
						:data-tooltip="$t('app.delete')"
						@click="deleteAnnotation"
						v-if="userCanEdit"
					><i class="icon icon-delete"></i></button>
				</div>
		</div>
	</div>

</template>

<script>

import { get, set, sync, call } from 'vuex-pathify';

import { linkify } from '@/plugins/linkify';

export default {

	name: 'AnnotationCard',

	props: {
		annotation: Object,
		stageConfig: Object,
	},

	directives: {
		linkify
	},

	watch: {
		'annotation': 'watchAnnotation',
	},

	computed: {

		...get([
			'userCanEdit',
			'hasUser',
			'authUser',
			'scale',
		]),

		containerClass() {

			var classes = [];

			if ( ! this.annotation) {
				return classes;
			}

			switch (this.annotation.type) {

				case 'visual':

					var posX = this.annotation.position[0];
					var posY = this.annotation.position[1];

					if (this.scale) {
						posX = Math.floor(posX * this.stageConfig.scale.x);
						posY = Math.floor(posY * this.stageConfig.scale.y);
					}

					if (posX > this.stageConfig.width / 2) {
						classes.push('on-left');
					} else {
						classes.push('on-right');
					}

					if (posY > this.stageConfig.height / 2) {
						classes.push('is-above');
					}

					break;
			}

			return classes;
		},

		containerStyle() {

			var style = {};

			if ( ! this.annotation) {
				return style;
			}

			switch (this.annotation.type) {

				case 'visual':

					var posX = this.annotation.position[0];
					var posY = this.annotation.position[1];

					if (this.scale) {
						posX = Math.floor(posX * this.stageConfig.scale.x);
						posY = Math.floor(posY * this.stageConfig.scale.y);
					}

					style.top = posY + 'px';
					style.left = posX + 'px';

					return style;

					break;
			}

		}
	},

	methods: {


		/**
		 * When an annotation is present, focus the textarea.
		 *
		 */
		watchAnnotation() {
			if (this.annotation) {
				this.$nextTick(() => {
					this.$refs.body.$el.focus();
				});
			}
		},


		/**
		 * Close the window.
		 *
		 */
		doOK() {
			this.$emit('close');
		},

		deleteAnnotation() {
			this.$emit('delete', this.annotation);
		}

	}

}

</script>

<style lang="scss" scoped>
.annotation-container {
	position: absolute;
}
</style>
