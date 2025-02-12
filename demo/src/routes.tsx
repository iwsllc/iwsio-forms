import { Route, Routes as ReactRoutes } from 'react-router'

import { FetchPage } from './FetchPage.js'
import { Layout } from './Layout.js'
import { InputCheckDemo } from './samples/InputCheckDemo.js'
import { InputDemo } from './samples/InputDemo.js'
import { InvalidFeedbackDemo } from './samples/InvalidFeedback.js'
import { RawExamples } from './samples/RawExamples.js'
import { UpstreamChangesPage } from './samples/UpstreamChangesPage.js'

export const Routes = () => {
	return (
		<ReactRoutes>
			<Route path="/" element={<Layout />}>
				<Route path="" element={<FetchPage page="index" />} />
				<Route path="examples" element={<FetchPage page="examples" demo={<RawExamples />} />} />
				<Route path="input" element={<FetchPage page="input" demo={<InputDemo />} />} />
				<Route path="invalid-feedback" element={<FetchPage page="invalid-feedback" demo={<InvalidFeedbackDemo />} />} />
				<Route path="input-check-radio" element={<FetchPage page="input-check-radio" demo={<InputCheckDemo />} />} />
				<Route path="select" element={<FetchPage page="select" demo={<InputDemo />} />} />
				<Route path="textarea" element={<FetchPage page="textarea" demo={<InputDemo />} />} />
				<Route path="upstream-test" element={<FetchPage page="upstream-test" demo={<UpstreamChangesPage />} />} />
				<Route path=":page" element={<FetchPage />} />
			</Route>
		</ReactRoutes>
	)
}
