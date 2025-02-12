import parser from 'html-react-parser'
import Prism from 'prismjs'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'

import { Busy } from './common/Busy.js'
import { useGetPage } from './services.js'

export const FetchPage = ({ demo, page }: { demo?: ReactNode, page?: string }) => {
	const [html, setHtml] = useState<string | undefined>()
	const refContent = useRef<HTMLDivElement>(null)

	const { page: paramsPage } = useParams()

	const pageName = useMemo(() => {
		if (page != null) return page
		return paramsPage
	}, [page, paramsPage])

	const { data, isSuccess, isError, isPending } = useGetPage(`/content/${pageName}.html`, pageName != null)

	useEffect(() => {
		if (isError) return
		if (!isSuccess) return
		setHtml(data)
	}, [isSuccess, isError, data])

	useEffect(() => {
		if (!html?.length) return
		refContent.current?.querySelectorAll('pre code').forEach((dom) => {
			Prism.highlightElement(dom)
		})
	}, [html])

	if (isPending) return <Busy />
	return (
		<>
			<div ref={refContent}>
				{
				// @ts-expect-error typing on default export is not detected
					html && html.length && parser(html)
				}
			</div>
			<div className="mt-5">
				{demo}
			</div>
		</>
	)
}
