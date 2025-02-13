import './index.css'
import './prism.js'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.js'
import reportWebVitals from './reportWebVitals.js'

export const DEV_MODE = import.meta.env.MODE !== 'production'

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
)
root.render(
	<StrictMode>
		<App />
	</StrictMode>
)

if (DEV_MODE) {
	// If you want to start measuring performance in your app, pass a function
	// to log results (for example: reportWebVitals(console.log))
	// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
	reportWebVitals()
}
