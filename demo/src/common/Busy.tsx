import { useEffect, useState } from 'react'

export const Busy = () => {
	const [show, setShow] = useState(false)

	// delay the spinner for a second before showing it. If the content loads fast, the spinner won't flicker
	useEffect(() => {
		setTimeout(() => {
			setShow(true)
		}, 1000)
	}, [])

	if (!show) return null

	return (
		<p className="flex flex-row items-center gap-0">
			<svg className="-ml-1 mr-3 size-5 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
				<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
			</svg>
			Loading...
		</p>
	)
}
