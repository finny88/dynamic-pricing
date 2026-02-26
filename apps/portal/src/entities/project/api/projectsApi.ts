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
			providesTags: (result) =>
				result
					? [...result.map(({ id }) => ({ type: 'Project' as const, id })), { type: 'Project', id: 'LIST' }]
					: [{ type: 'Project', id: 'LIST' }],
		}),
		getProject: builder.query<Project | undefined, string>({
			query: (id) => ({ url: `/projects/${id}` }),
			transformResponse: (response: { project?: Project }) => response.project,
			providesTags: (
				_result, _error, id
			) => [{ type: 'Project' as const, id }],
		}),
		createProject: builder.mutation<Project, CreateProjectDto>({
			query: (data) => ({ url: '/projects', method: 'POST', data }),
			invalidatesTags: [{ type: 'Project', id: 'LIST' }],
		}),
		updateProject: builder.mutation<Project, CreateProjectDto>({
			query: ({ id, ...data }) => ({ url: `/projects/${id}`, method: 'PUT', data: { id, ...data } }),
			invalidatesTags: (
				_result, _error, { id }
			) => [
				{ type: 'Project', id: 'LIST' },
				{ type: 'Project', id },
			],
		}),
		deleteProject: builder.mutation<void, string>({
			query: (id) => ({ url: `/projects/${id}`, method: 'DELETE' }),
			invalidatesTags: (
				_result, _error, id
			) => [
				{ type: 'Project', id: 'LIST' },
				{ type: 'Project', id },
			],
		}),
	}),
})

export const { useGetProjectsQuery, useGetProjectQuery, useCreateProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation } = projectsApi
