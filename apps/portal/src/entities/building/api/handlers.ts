import { http, HttpResponse, type PathParams } from 'msw'
import { addItem, getAllByIndex, getById, updateItem, STORES } from '@shared/lib/db'
import type { Building } from '../model/building'
import type { CreateBuildingDto } from './buildingsApi'

export const buildingHandlers = [
	http.get<{ projectId: string }>('/api/projects/:projectId/buildings', async ({ params }) => {
		const buildings = await getAllByIndex<Building>(
			STORES.BUILDINGS, 'projectId', params.projectId
		)
		return HttpResponse.json({ buildings })
	}),

	http.post<PathParams, CreateBuildingDto>('/api/projects/:projectId/buildings', async ({ params, request }) => {
		const projectId = params['projectId'] as string
		const body = await request.json()
		const building: Building = { ...body, projectId, updatedAt: new Date().toISOString() }
		await addItem<Building>(STORES.BUILDINGS, building)

		const project = await getById<{ id: string; buildingsCount: number; updatedAt: string } & Record<string, unknown>>(STORES.PROJECTS, projectId)
		if (project) {
			await updateItem(STORES.PROJECTS, { ...project, buildingsCount: project.buildingsCount + 1, updatedAt: new Date().toISOString() })
		}

		return HttpResponse.json({ building }, { status: 201 })
	}),
]
