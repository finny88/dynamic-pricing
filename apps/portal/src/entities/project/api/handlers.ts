import { http, HttpResponse } from 'msw'
import projectsData from '@shared/assets/projects.json'

export const projectHandlers = [
	http.get('/api/projects', () => {
		return HttpResponse.json(projectsData)
	}),
]
