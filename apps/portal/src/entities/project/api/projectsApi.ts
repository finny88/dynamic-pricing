import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Project } from '../model/project'

export const projectsApi = createApi({
	reducerPath: 'projectsApi',
	baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
	endpoints: (builder) => ({
		getProjects: builder.query<Project[], void>({
			query: () => '/projects',
			transformResponse: (response: { projects: Project[] }) => response.projects,
		}),
	}),
})

export const { useGetProjectsQuery } = projectsApi
