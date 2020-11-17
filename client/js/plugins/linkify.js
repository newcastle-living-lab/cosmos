import linkifyStr from 'linkifyjs/string';

function linkify(el, binding) {
	el.innerHTML = linkifyStr(binding.value, {
		defaultProtocol: 'https'
	})
}

export {
	linkify
}
