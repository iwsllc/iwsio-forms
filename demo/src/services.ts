import { useGet } from './fetchFromPublic.js'

export const useGetPage = (path: string, enabled: boolean) => useGet<string>(path, { resolveWithResponseBody: true, enabled, staleTime: 30 * 60 * 1000 /** 30 minutes */ })
