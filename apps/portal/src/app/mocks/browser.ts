import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

export const workerOptions = {
	onUnhandledRequest: 'bypass' as const,
	serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
}
