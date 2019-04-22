module.exports = {
	preset: 'ts-jest',
	verbose: true,
	testEnvironment: 'node',
	moduleDirectories: ['node_modules', 'src'],
	globals: {
		'ts-jest': {
			diagnostics: {
				ignoreCodes: [2739]
			}
		}
	}
};
