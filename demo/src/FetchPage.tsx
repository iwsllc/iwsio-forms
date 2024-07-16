import { FC, ReactNode, useRef, useEffect, useMemo, useState } from 'react'
import { Busy } from './common/Busy'
import { useLocation, useParams } from 'react-router-dom'
import Prism from 'prismjs'

type PageData = { html?: string, name: string, loaded: Date }

export const FetchPage: FC<{ demo?: ReactNode, page?: string }> = ({ demo, page }) => {
	const location = useLocation()
	const refLocation = useRef('')
	const [pages, setPages] = useState<PageData[]>([])
	const [html, setHtml] = useState<string | undefined>()
	const [loading, setLoading] = useState(false)
	const refContent = useRef(null)

	const { page: paramsPage } = useParams()

	const pageName = useMemo(() => {
		if (page != null) return page
		return paramsPage
	}, [page, paramsPage])

	const fetchContent = async (name: string) => {
		if (!name?.trim().length) return // skip load
		let cached = pages.find(p => p.name === name)
		if (cached == null) {
			setLoading(true)
			const response = await fetch(`/content/${name}.html`)
			const text = await response.text()
			cached = { name: name, html: text, loaded: new Date() }
			setPages((old) => {
				if (!old.find(o => o.name === cached.name)) {
					return [...old, cached]
				}
				return [...old]
			})
		} else {
			cached.loaded = new Date()
		}
		setHtml(cached.html)
		setLoading(() => false)
	}

	useEffect(() => {
		if (!html?.length) return
		refContent.current?.querySelectorAll('pre code').forEach((dom) => {
			Prism.highlightElement(dom)
		})
	}, [html])

	useEffect(() => {
		// debounce the fetch
		const timeoutId = setTimeout(() => {
			fetchContent(pageName).catch(console.error)
		}, 200)
		return () => {
			clearTimeout(timeoutId)
		}
	}, [pageName])

	// NOTE: since we're re-using this component for multiple routes, we want to reset it when a new route is incoming. This prevents the flicker render of the last demo before loading the new page.
	useEffect(() => {
		if (refLocation.current !== location.pathname) {
			setLoading(() => true)
			setHtml(undefined)
		}
		refLocation.current = location.pathname
	}, [location])

	if (loading) return <Busy />
	return (
		<>
			<div ref={refContent} dangerouslySetInnerHTML={{ __html: html }} />
			<div className="mt-5">
				{demo}
			</div>
		</>
	)
}
