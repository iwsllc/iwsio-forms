module.exports = {
	presets: [
		'@babel/preset-env',
		['@babel/preset-react', { runtime: 'automatic' }],
		['@babel/typescript', { isTSX: true, allExtensions: true }]
	],
	plugins: [['prismjs', {
		languages: ['javascript', 'jsx', 'tsx', 'bash'],
		plugins: ['line-numbers'],
		theme: 'okaidia',
		css: true
	}]]
}
