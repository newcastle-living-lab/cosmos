<template>

	<div class="dropdown dropdown-right dropdown-language">

		<button class='btn btn-sm dropdown-toggle '><gb-flag :code="flagCode(currentLanguage)" size="small" /> {{  $t(`languages.${currentLanguage}`) }} <i class="icon icon-caret"></i></button>
		<ul class="menu">
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
			 <!-- <li class="menu-item"><a href="javascript:;">Language 1</a></li>
			 <li class="menu-item"><a href="javascript:;">Language 2</a></li> -->
		</ul>
	</div>

</template>

<script>

import Trans from '@/services/Trans';

export default {

	computed: {
		supportedLanguages () {
			return Trans.supportedLanguages()
		},
		currentLanguage () {
			return Trans.currentLanguage()
		}
	},
	methods: {
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
