const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const withTM = require('next-transpile-modules')([
	// `monaco-editor` isn't published to npm correctly: it includes both CSS
	// imports and non-Node friendly syntax, so it needs to be compiled.
	'monaco-editor',
]);

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = withTM({
	outputFileTracing: false,
	webpack: (config) => {
		const rule = config.module.rules
			.find((rule) => rule.oneOf)
			.oneOf.find(
				(r) =>
					// Find the global CSS loader
					r.issuer && r.issuer.include && r.issuer.include.includes('_app')
			);
		if (rule) {
			rule.issuer.include = [
				rule.issuer.include,
				// Allow `monaco-editor` to import global CSS:
				/[\\/]node_modules[\\/]monaco-editor[\\/]/,
			];
		}

		config.plugins.push(
			new MonacoWebpackPlugin({
				languages: ['java', 'python', 'swift', 'cpp', 'typescript', 'javasript'],
				filename: 'static/[name].worker.js',
			})
		);

		return config;
	},
});

module.exports = nextConfig;
