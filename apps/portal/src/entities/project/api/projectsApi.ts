import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@shared/api'
import type { Project } from '../model/project'

export type CreateProjectDto = Omit<Project, 'updatedAt'>

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
		updateProject: builder.mutation<Project, CreateProjectDto>({
			query: ({ id, ...data }) => ({ url: `/projects/${id}`, method: 'PUT', data: { id, ...data } }),
			invalidatesTags: ['Project'],
		}),
	}),
})

export const { useGetProjectsQuery, useCreateProjectMutation, useUpdateProjectMutation } = projectsApi
