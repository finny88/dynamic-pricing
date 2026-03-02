import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const enableMocking = async () => {
	const { worker, workerOptions } = await import('./mocks/browser')
	return worker.start(workerOptions)
}

enableMocking().then(() => {
	createRoot(document.getElementById('root')!).render(<StrictMode>
		<App />
	</StrictMode>,)
})
