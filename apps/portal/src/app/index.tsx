import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const enableMocking = async () => {
	const { worker } = await import('./mocks/browser')
	return worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
	createRoot(document.getElementById('root')!).render(<StrictMode>
		<App />
	</StrictMode>,)
})
