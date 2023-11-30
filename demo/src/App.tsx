import { BrowserRouter } from 'react-router-dom'
import { Routes } from './routes'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const client = new QueryClient()

export const App = () => (
	<QueryClientProvider client={client}>
		<BrowserRouter>
			<Routes />
		</BrowserRouter>
	</QueryClientProvider>
)

export default App
