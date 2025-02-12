import { ErrorBody, FetchError, setupFetch } from '@iwsio/fetch'
import { useQuery, UseQueryResult } from '@tanstack/react-query'

// setup shared instances of the fetch utility functions.
const utils = setupFetch<ErrorBody>(``)
export const { getMany, getOne, post, patch, postOne, fetch, get } = utils

export interface HasId { id: string }

export const useGet = <Response>(endpoint: string, options: any = {}, additionalQKeys: string[] = []): UseQueryResult<Response, FetchError<ErrorBody>> => {
	const { resolveWithResponseBody, ...others } = options
	return useQuery({ queryKey: [...additionalQKeys, endpoint], queryFn: () => get<Response>(endpoint, { resolveWithResponseBody }), ...others })
}
