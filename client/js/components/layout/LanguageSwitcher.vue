<template>

	<div class="dropdown dropdown-right dropdown-language" :class="{ 'active': showMenu }" v-click-outside="hideMenuOutside">

		<button class='btn btn-sm' @click.prevent="toggleMenu"><gb-flag :code="flagCode(currentLanguage)" size="small" /> {{  $t(`languages.${currentLanguage}`) }} <i class="icon icon-caret"></i></button>
		<ul class="menu" >
			<li
				v-for="lang in supportedLanguages"
				:key="lang"
				:selected="isCurrentLanguage(lang)"
				:class="{ 'active': isCurrentLanguage(lang) }"
				class="menu-item"
			>
				<a href="javascript:;" @click="changeLanguage(lang)">
					<gb-flag :code="flagCode(lang)" size="small" />
					{{ $t(`languages.${lang}`) }}
				</a>
			</li>
		</ul>
	</div>

</template>

<script>

import vClickOutside from 'v-click-outside';

import Trans from '@/services/Trans';

export default {

	directives: {
		clickOutside: vClickOutside.directive
    },

	data() {
		return {
			showMenu: false
		}
	},

	computed: {
		supportedLanguages () {
			return Trans.supportedLanguages()
		},
		currentLanguage () {
			return Trans.currentLanguage()
		}
	},
	methods: {
		toggleMenu() {
			if (this.showMenu) {
				console.log("toggle: hiding menu");
				this.showMenu = false;
			} else {
				console.log("toggle: showing menu");
				this.showMenu = true;
			}
		},
		hideMenuOutside() {
			console.log("click outside");
			if (this.showMenu === true) {
				console.log("hiding menu");
				this.showMenu = false;
			}
		},
		changeLanguage(lang) {
			return Trans.changeLanguage(lang);
		},
		isCurrentLanguage (lang) {
			return lang === this.currentLanguage
		},
		flagCode(lang) {
			var code = lang;
			switch (lang) {
				case 'el': code = 'ee'; break;
				case 'en_GB': code = 'gb'; break;
				case 'sv_SE': code = 'se'; break;
			}
			return code;
		}
	}
}

</script>
