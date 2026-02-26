import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@shared/api'
import { invalidateProjectById } from '@entities/project/@x/building'
import type { Building } from '../model/building'

export type CreateBuildingDto = Omit<Building, 'updatedAt'>

export const buildingsApi = createApi({
	reducerPath: 'buildingsApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Building'],
	endpoints: (builder) => ({
		getBuildingsByProject: builder.query<Building[], string>({
			query: (projectId) => ({ url: `/projects/${projectId}/buildings` }),
			transformResponse: (response: { buildings: Building[] }) => response.buildings,
			providesTags: (
				result, _error, projectId
			) =>
				result
					? [...result.map(({ id }) => ({ type: 'Building' as const, id })), { type: 'Building', id: `LIST_${projectId}` }]
					: [{ type: 'Building', id: `LIST_${projectId}` }],
		}),
		createBuilding: builder.mutation<Building, CreateBuildingDto>({
			query: ({ projectId, ...data }) => ({ url: `/projects/${projectId}/buildings`, method: 'POST', data: { projectId, ...data } }),
			invalidatesTags: (
				_result, _error, { projectId }
			) => [{ type: 'Building', id: `LIST_${projectId}` }],
			async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled
					dispatch(invalidateProjectById(projectId))
				} catch { /* mutation error is handled by errorMiddleware */ }
			},
		}),
	}),
})

export const { useGetBuildingsByProjectQuery, useCreateBuildingMutation } = buildingsApi
