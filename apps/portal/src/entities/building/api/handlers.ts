import { http, HttpResponse, type PathParams } from 'msw'
import { addItem, deleteItem, getAllByIndex, getById, updateItem, STORES } from '@shared/lib/db'
import type { Building } from '../model/building'
import type { CreateBuildingDto } from './buildingsApi'

export const buildingHandlers = [
	http.get<{ projectId: string }>('/api/projects/:projectId/buildings', async ({ params }) => {
		const buildings = await getAllByIndex<Building>(
			STORES.BUILDINGS, 'projectId', params.projectId
		)
		return HttpResponse.json({ buildings })
	}),

	http.get<{ projectId: string; buildingId: string }>('/api/projects/:projectId/buildings/:buildingId', async ({ params }) => {
		const building = await getById<Building>(STORES.BUILDINGS, params.buildingId)
		if (!building) { return new HttpResponse(null, { status: 404 }) }
		return HttpResponse.json({ building })
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

	http.put<{ projectId: string; buildingId: string }, CreateBuildingDto>('/api/projects/:projectId/buildings/:buildingId', async ({ params, request }) => {
		const body = await request.json()
		const totalArea = Math.round(body.units.reduce((sum, unit) => sum + Number(unit.totalAreaSqm), 0))
		const building: Building = { ...body, totalArea, updatedAt: new Date().toISOString() }
		await updateItem<Building>(STORES.BUILDINGS, building)

		const buildings = await getAllByIndex<Building>(
			STORES.BUILDINGS, 'projectId', params.projectId
		)
		const lotsCount = buildings.reduce((sum, b) => sum + b.units.length, 0)
		const buildingsTotalArea = buildings.reduce((sum, b) => sum + b.totalArea, 0)

		const project = await getById<{
			id: string
			buildingsCount: number
			lotsCount: number
			totalArea: number
			updatedAt: string
		} & Record<string, unknown>>(STORES.PROJECTS, params.projectId)
		if (project) {
			await updateItem(STORES.PROJECTS, {
				...project,
				lotsCount,
				totalArea: buildingsTotalArea,
				updatedAt: new Date().toISOString(),
			})
		}

		return HttpResponse.json({ building })
	}),

	http.delete<{ projectId: string; buildingId: string }>('/api/projects/:projectId/buildings/:buildingId', async ({ params }) => {
		await deleteItem(STORES.BUILDINGS, params.buildingId)

		const project = await getById<{ id: string; buildingsCount: number; updatedAt: string } & Record<string, unknown>>(STORES.PROJECTS, params.projectId)
		if (project) {
			await updateItem(STORES.PROJECTS, { ...project, buildingsCount: project.buildingsCount - 1, updatedAt: new Date().toISOString() })
		}

		return new HttpResponse(null, { status: 204 })
	}),
]
