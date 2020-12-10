<template>

	<v-group>
		<v-image :config="imageConfig"/>
	</v-group>

</template>

<script>

import { get } from 'vuex-pathify';

export default {

	name: 'CosmosImage',

	_image: null,

	props: {
		options: Object,
		definitionName: String,
		config: Object,
	},

	data() {
		return {
			image: null,
		}
	},

	watch: {
		'config.filename': 'setImage'
	},

	computed: {
		imageConfig() {
			return {
				x: this.config.x ? this.config.x : 0,
				y: this.config.y ? this.config.y : 0,
				image: this.image,
				scale: this.config.scale ? this.config.scale : { x: 1, y: 1 },
				rotation: this.config.rotation ? this.config.rotation : 0,
				visible: typeof(this.config.visible) !== 'undefined' ? this.config.visible : true,
				opacity: typeof(this.config.opacity) !== 'undefined' ? this.config.opacity : 1,
			}
		},
	},

	methods: {
		setImage() {
			if ( ! this._image) {
				this._image = new window.Image();
			}
			this._image.src = `/images/aspects/${this.config.filename}`;
			this._image.onload = () => {
				this.image = this._image;
			};
		}
	},

	created() {
		this.setImage();
	}

}
</script>
