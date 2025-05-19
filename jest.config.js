module.exports = {
	preset: '@wordpress/jest-preset-default',
	setupFilesAfterEnv: [
		'<rootDir>/src/dmg/readmore/components/tests/setup-test-env.js',
	],
	testMatch: [ '**/src/dmg/readmore/**/tests/**/*.js' ],
	testPathIgnorePatterns: [ '/node_modules/', '/setup-test-env.js' ],
	transform: {
		'^.+\\.[jt]sx?$':
			'<rootDir>/node_modules/@wordpress/scripts/config/babel-transform',
	},
};
