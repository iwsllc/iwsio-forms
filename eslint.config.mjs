import { fileURLToPath } from 'node:url'

import { configure } from '@iwsio/eslint-config'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Browser only projects here
const excludeWorkspacesFromNodeRules = ['forms', 'demo']

// NOTE: default style linter is stylistic with tabs.
export default configure({
	includeReact: true,
	includeTailwind: true,
	autoFindMonorepoPackages: true,
	excludeWorkspacesFromNodeRules,
	rootDir: __dirname
})
