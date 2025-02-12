import { configure } from '@iwsio/eslint-config'

// package names of packages in this monorepo
const monoRepoPackages = []

// paths of node projects in this monorepo
const monoRepoNodeProjects = []

// NOTE: default style linter is stylistic with tabs.
export default configure({ monoRepoPackages, monoRepoNodeProjects })
