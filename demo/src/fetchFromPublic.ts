import { type FetchError, setupFetch } from '@iwsio/fetch'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'

export interface ErrorBody {
	error?: string
	stack?: string
}

// setup shared instances of the fetch utility functions.
const utils = setupFetch<ErrorBody>(``)
export const { getMany, getOne, post, patch, postOne, fetch, get } = utils

export interface HasId {
	id: string
}

export const useGet = <Response>(
	endpoint: string,
	// biome-ignore lint/suspicious/noExplicitAny: passthrough options bag for the underlying query
	options: any = {},
	additionalQKeys: string[] = []
): UseQueryResult<Response, FetchError<ErrorBody>> => {
	const { resolveWithResponseBody, ...others } = options
	return useQuery<Response, FetchError<ErrorBody>>({
		queryKey: [...additionalQKeys, endpoint],
		queryFn: () => get<Response>(endpoint, { resolveWithResponseBody }),
		...others
	})
}
