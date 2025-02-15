import { useEffect } from 'react'

export const GoogleTag = () => {
	useEffect(() => {
		if (import.meta.env.MODE === 'development') return

		const script = document.createElement('script')
		script.innerHTML = `(function (w, d, s, l, i) {
w[l] = w[l] || []; w[l].push({
'gtm.start':
new Date().getTime(), event: 'gtm.js'
}); var f = d.getElementsByTagName(s)[0],
j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-5T8NZS4F');`
		script.async = true
		document.head.appendChild(script)
		return () => {
			document.head.removeChild(script)
		}
	}, [])
	return null
}
