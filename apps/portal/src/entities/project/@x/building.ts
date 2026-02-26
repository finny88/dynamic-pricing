import { projectsApi } from '../api/projectsApi'

export const invalidateProjectById = (id: string) =>
	projectsApi.util.invalidateTags([{ type: 'Project' as const, id }])
