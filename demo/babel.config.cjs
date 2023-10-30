module.exports = {
	presets: [
		'@babel/preset-env',
		['@babel/preset-react', { runtime: 'automatic' }],
		['@babel/typescript', { isTSX: true, allExtensions: true }]
	],
	plugins: [['prismjs', {
		languages: ['javascript', 'css', 'markup', 'typescript', 'jsx', 'tsx', 'bash', 'csv', 'docker', 'yaml'],
		plugins: ['line-numbers'],
		theme: 'okaidia',
		css: true
	}]]
}
