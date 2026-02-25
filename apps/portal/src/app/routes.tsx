import { BuildingPage } from '@pages/building'
import { BuildingViewerPage } from '@pages/building-viewer'
import { ProjectsPage } from '@pages/projects'

export const routes = [
	{ path: '/', element: <ProjectsPage /> },
	{ path: '/building', element: <BuildingPage /> },
	{ path: '/viewer', element: <BuildingViewerPage /> },
]
