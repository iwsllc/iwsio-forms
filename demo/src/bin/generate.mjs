import { readdir, readFile, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

import MarkdownIt from 'markdown-it'
import { fileURLToPath } from 'url'

const md = new MarkdownIt({ html: true })
const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function begin(..._args) {
	const baseDir = join(__dirname, '../content')
	const files = await readdir(baseDir)
	console.log(`Found ${files.length} files...`)
	for (const file of files) {
		try {
			const fileContent = await readFile(join(baseDir, file), { encoding: 'utf8' })
			const html = md.render(fileContent)
			const newName = file.replace(extname(file), '.html')
			console.log(`Writing ${newName}`)
			await writeFile(join(__dirname, '../../public/content', newName), html, { encoding: 'utf8' })
		} catch (err) {
			console.error(err)
		}
	}
}

await begin(process.env.argv)
