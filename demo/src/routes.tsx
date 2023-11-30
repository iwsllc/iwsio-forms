import { Route, Routes as ReactRoutes } from 'react-router-dom'
import { Layout } from './Layout'
import { FetchPage } from './FetchPage'
import { InputDemo } from './samples/InputDemo'
import { InputCheckDemo } from './samples/InputCheckDemo'
import { RawExamples } from './samples/RawExamples'
import { InvalidFeedbackDemo } from './samples/InvalidFeedback'
import { UpstreamChangesTest } from './samples/UpstreamChangesTest'

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
				<Route path="upstream-test" element={<FetchPage page="test" demo={<UpstreamChangesTest />} />} />
				<Route path=":page" element={<FetchPage />} />
			</Route>
		</ReactRoutes>
	)
}
