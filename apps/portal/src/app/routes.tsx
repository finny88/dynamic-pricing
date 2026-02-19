import { BuildingPage } from '@pages/building'
import { BuildingViewerPage } from '@pages/building-viewer'

export const routes = [
	{ path: '/', element: <BuildingPage /> },
	{ path: '/viewer', element: <BuildingViewerPage /> },
]
