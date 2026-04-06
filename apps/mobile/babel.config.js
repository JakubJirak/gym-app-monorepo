module.exports = (api) => {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			// ostatní pluginy
			"react-native-worklets/plugin",
		],
	};
};
