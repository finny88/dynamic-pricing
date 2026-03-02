import { rootApi } from '@shared/api'
import type { Project } from '../model/project'

export type CreateProjectDto = Omit<Project, 'updatedAt'>

export const PROJECT_TAG = 'Project' as const

export const projectsApi = rootApi
	.enhanceEndpoints({ addTagTypes: [PROJECT_TAG] })
	.injectEndpoints({
		endpoints: (builder) => ({
			getProjects: builder.query<Project[], void>({
				query: () => ({ url: '/projects' }),
				transformResponse: (response: { projects: Project[] }) => response.projects,
				providesTags: (result) =>
					result
						? [...result.map(({ id }) => ({ type: PROJECT_TAG, id })), { type: PROJECT_TAG, id: 'LIST' }]
						: [{ type: PROJECT_TAG, id: 'LIST' }],
			}),
			getProject: builder.query<Project | undefined, string>({
				query: (id) => ({ url: `/projects/${id}` }),
				transformResponse: (response: { project?: Project }) => response.project,
				// eslint-disable-next-line max-params
				providesTags: (
					_result, _error, id
				) => [{ type: PROJECT_TAG, id }],
			}),
			createProject: builder.mutation<Project, CreateProjectDto>({
				query: (data) => ({ url: '/projects', method: 'POST', data }),
				invalidatesTags: [{ type: PROJECT_TAG, id: 'LIST' }],
			}),
			updateProject: builder.mutation<Project, CreateProjectDto>({
				query: ({ id, ...data }) => ({ url: `/projects/${id}`, method: 'PUT', data: { id, ...data } }),
				// eslint-disable-next-line max-params
				invalidatesTags: (
					_result, _error, { id }
				) => [
					{ type: PROJECT_TAG, id: 'LIST' },
					{ type: PROJECT_TAG, id },
				],
			}),
			deleteProject: builder.mutation<void, string>({
				query: (id) => ({ url: `/projects/${id}`, method: 'DELETE' }),
				// eslint-disable-next-line max-params
				invalidatesTags: (
					_result, _error, id
				) => [
					{ type: PROJECT_TAG, id: 'LIST' },
					{ type: PROJECT_TAG, id },
				],
			}),
		}),
	})

export const { useGetProjectsQuery, useGetProjectQuery, useCreateProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation } = projectsApi
