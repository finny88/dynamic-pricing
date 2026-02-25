import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@shared/api'
import type { Project } from '../model/project'

export type CreateProjectDto = Pick<Project, 'id' | 'name'> & Partial<Pick<Project, 'code' | 'city' | 'address' | 'housingClass'>>

export const projectsApi = createApi({
	reducerPath: 'projectsApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Project'],
	endpoints: (builder) => ({
		getProjects: builder.query<Project[], void>({
			query: () => ({ url: '/projects' }),
			transformResponse: (response: { projects: Project[] }) => response.projects,
			providesTags: ['Project'],
		}),
		createProject: builder.mutation<Project, CreateProjectDto>({
			query: (data) => ({ url: '/projects', method: 'POST', data }),
			invalidatesTags: ['Project'],
		}),
	}),
})

export const { useGetProjectsQuery, useCreateProjectMutation } = projectsApi
