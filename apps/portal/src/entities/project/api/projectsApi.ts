import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@shared/api'
import type { Project } from '../model/project'

export const projectsApi = createApi({
	reducerPath: 'projectsApi',
	baseQuery: axiosBaseQuery(),
	endpoints: (builder) => ({
		getProjects: builder.query<Project[], void>({
			query: () => ({ url: '/projects' }),
			transformResponse: (response: { projects: Project[] }) => response.projects,
		}),
	}),
})

export const { useGetProjectsQuery } = projectsApi
