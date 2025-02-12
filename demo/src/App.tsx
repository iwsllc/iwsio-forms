import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router'

import { GoogleTag } from './common/GoogleTag.js'
import { Routes } from './routes.js'

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnMount: false, refetchOnWindowFocus: false } } })
export const DEV_MODE = import.meta.env.MODE !== 'production'

export const App = () => (
	<QueryClientProvider client={queryClient}>
		<BrowserRouter>
			<Routes />
		</BrowserRouter>
		{DEV_MODE && <ReactQueryDevtools initialIsOpen={false} />}
		<GoogleTag />
	</QueryClientProvider>
)

export default App
