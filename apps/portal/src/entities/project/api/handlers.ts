import { http, HttpResponse } from 'msw'
import { getAll, STORES } from '@shared/lib/db'
import type { Project } from '../model/project'

export const projectHandlers = [
	http.get('/api/projects', async () => {
		const projects = await getAll<Project>(STORES.PROJECTS)
		return HttpResponse.json({ projects })
	}),
]
