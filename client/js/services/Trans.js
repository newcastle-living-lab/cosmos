import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/data/languages';
import i18n from '@/plugins/i18n';
import langs from '@/lang';

const Trans = {


	defaultLanguage() {
		return DEFAULT_LANGUAGE
	},


	supportedLanguages() {
		return SUPPORTED_LANGUAGES
	},


	currentLanguage() {
		return i18n.locale
	},


	setCurrentLanguage(lang) {
		i18n.locale = lang
	},


	/**
	* Gets the first supported language that matches the user's
	* @return {String}
	*
	*/
	getUserSupportedLang() {

		const userPreferredLang = Trans.getUserLang();

		// Check if user preferred browser lang is supported
		if (Trans.isLangSupported(userPreferredLang.lang)) {
			return userPreferredLang.lang
		}

		// Check if user preferred lang without the ISO is supported
		if (Trans.isLangSupported(userPreferredLang.langNoISO)) {
			return userPreferredLang.langNoISO
		}

		return Trans.defaultLanguage();
	},


	/**
	 * Returns the users preferred language
	 *
	 */
	getUserLang () {
		const lang = window.localStorage.getItem('lang') || window.navigator.language || window.navigator.userLanguage || Trans.defaultLanguage()
		return {
			lang: lang,
			langNoISO: lang.split('-')[0]
		}
	},

	/**
	 * Sets the language to various services (axios, the html tag etc)
	 * @param {String} lang
	 * @return {String} lang
	 *
	 */
	setI18nLanguageInServices(lang) {
		Trans.setCurrentLanguage(lang);
		localStorage.setItem('lang', lang);
		document.querySelector('html').setAttribute('lang', lang)
		return lang
	},


	/**
	 * Loads new translation messages and changes the language when finished
 	 * @param lang
	 * @return {Promise<any>}
	 *
	 */
	changeLanguage(lang) {
		if (!Trans.isLangSupported(lang)) return Promise.reject(new Error('Language not supported'))
		if (i18n.locale === lang) return Promise.resolve(lang) // has been loaded prior
		// return Promise.resolve(() => {
		// 	const msgs = langs[lang];
		// 	i18n.setLocaleMessage(lang, msgs.default || msgs)
		// 	return Trans.setI18nLanguageInServices(lang)
		// })
		return Trans.loadLanguageFile(lang).then(msgs => {
			// console.log(msgs);
			i18n.setLocaleMessage(lang, msgs.default || msgs)
			return Trans.setI18nLanguageInServices(lang)
		});
	},


	/**
 	* Async loads a translation file
	 * @param lang
	 * @return {Promise<*>|*}
	 *
	 */
	loadLanguageFile (lang) {
		return Promise.resolve(langs[lang]);
		// return langs[lang];
		// return import(/* webpackChunkName: "lang/lang-[request]" */ `@/lang/${lang}.json`);
	},


	/**
	* Checks if a lang is supported
	* @param {String} lang
	* @return {boolean}
	*/
	isLangSupported (lang) {
		return Trans.supportedLanguages().includes(lang);
	},


	codeToFlag(lang) {
		var code = lang;
		switch (lang) {
			case 'el': code = 'ee'; break;
			case 'en_GB': code = 'gb'; break;
			case 'sv_SE': code = 'se'; break;
		}

		return code;
	}


}

// export { Trans }
export default Trans;
