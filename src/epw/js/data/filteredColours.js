import colours from 'colors.css';

let filtered = [];

const keys = Object.keys(colours)
for (const key of keys) {
	filtered.push({
		name: key.charAt(0).toUpperCase() + key.slice(1),
		value: colours[key]
	});
}

export default filtered;
