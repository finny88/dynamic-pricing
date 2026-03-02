import { http, HttpResponse, type PathParams } from 'msw'
import type { Building } from '@entities/building/@x/building'
import { addItem, deleteItem, getAll, getAllByIndex, getById, updateItem, STORES } from '@shared/lib/db'
import type { Project } from '../model/project'
import type { CreateProjectDto } from './projectsApi'

export const projectHandlers = [
	http.get('/api/projects', async () => {
		const projects = await getAll<Project>(STORES.PROJECTS)
		return HttpResponse.json({ projects })
	}),

	http.get<{ id: string }>('/api/projects/:id', async ({ params }) => {
		const project = await getById<Project>(STORES.PROJECTS, params.id)
		if (!project) {
			return new HttpResponse(null, { status: 404 })
		}
		return HttpResponse.json({ project })
	}),

	http.post<PathParams, CreateProjectDto>('/api/projects', async ({ request }) => {
		const body = await request.json()
		const project: Project = { ...body, updatedAt: new Date().toISOString() }
		await addItem<Project>(STORES.PROJECTS, project)
		return HttpResponse.json({ project }, { status: 201 })
	}),

	http.put<{ id: string }, CreateProjectDto>('/api/projects/:id', async ({ params, request }) => {
		const body = await request.json()
		const project: Project = { ...body, id: params.id, updatedAt: new Date().toISOString() }
		await updateItem<Project>(STORES.PROJECTS, project)
		return HttpResponse.json({ project })
	}),

	http.delete<{ id: string }>('/api/projects/:id', async ({ params }) => {
		const buildings = await getAllByIndex<Building>(
			STORES.BUILDINGS, 'projectId', params.id
		)
		for (const building of buildings) {
			await deleteItem(STORES.BUILDINGS, building.id)
		}
		await deleteItem(STORES.PROJECTS, params.id)
		return new HttpResponse(null, { status: 204 })
	}),
]
