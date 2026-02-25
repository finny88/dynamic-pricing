import { BuildingPage } from '@pages/building'
import { BuildingViewerPage } from '@pages/building-viewer'
import { ProjectsPage } from '@pages/projects'

export const routes = [
	{ path: '/projects', element: <ProjectsPage /> },
	{ path: '/', element: <BuildingPage /> },
	{ path: '/viewer', element: <BuildingViewerPage /> },
]
