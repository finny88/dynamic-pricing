import { Navigate } from 'react-router-dom'
import { BuildingPage } from '@pages/building'
import { BuildingExportPage } from '@pages/building-export'
import { ProjectPage } from '@pages/project'
import { ProjectsPage } from '@pages/projects'

export const routes = [
	{ path: '/projects', element: <ProjectsPage /> },
	{ path: '/projects/:id', element: <ProjectPage /> },
	{ path: '/projects/:projectId/buildings/:buildingId', element: <BuildingPage /> },
	{ path: '/projects/:projectId/buildings/:buildingId/export', element: <BuildingExportPage /> },
	{ path: '/', element: <Navigate to={'/projects'} replace /> },
]
