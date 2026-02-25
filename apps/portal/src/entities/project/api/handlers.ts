import { http, HttpResponse } from 'msw'
import { addItem, getAll, STORES } from '@shared/lib/db'
import type { Project } from '../model/project'

export const projectHandlers = [
	http.get('/api/projects', async () => {
		const projects = await getAll<Project>(STORES.PROJECTS)
		return HttpResponse.json({ projects })
	}),

	http.post('/api/projects', async ({ request }) => {
		const project = await request.json() as Project
		await addItem<Project>(STORES.PROJECTS, project)
		return HttpResponse.json({ project }, { status: 201 })
	}),
]
