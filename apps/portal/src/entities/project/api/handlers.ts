import { http, HttpResponse, type PathParams } from 'msw'
import { addItem, getAll, STORES } from '@shared/lib/db'
import type { Project } from '../model/project'
import type { CreateProjectDto } from './projectsApi'

export const projectHandlers = [
	http.get('/api/projects', async () => {
		const projects = await getAll<Project>(STORES.PROJECTS)
		return HttpResponse.json({ projects })
	}),

	http.post<PathParams, CreateProjectDto>('/api/projects', async ({ request }) => {
		const body = await request.json()
		if (body.code) {
			const projects = await getAll<Project>(STORES.PROJECTS)
			if (projects.some((p) => p.code === body.code)) {
				return HttpResponse.json({ error: 'Проект с таким кодом уже существует' }, { status: 409 })
			}
		}
		const project: Project = { ...body, updatedAt: new Date().toISOString() }
		await addItem<Project>(STORES.PROJECTS, project)
		return HttpResponse.json({ project }, { status: 201 })
	}),
]
