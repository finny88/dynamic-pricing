import { PROJECT_TAG } from '@entities/project/@x/building'
import { rootApi } from '@shared/api'
import type { Building } from '../model/building'

export type CreateBuildingDto = Omit<Building, 'updatedAt'>

const BUILDING_TAG = 'Building' as const

export const buildingsApi = rootApi
	.enhanceEndpoints({ addTagTypes: [BUILDING_TAG, PROJECT_TAG] })
	.injectEndpoints({
		endpoints: (builder) => ({
			getBuildingById: builder.query<Building, { projectId: string; buildingId: string }>({
				query: ({ projectId, buildingId }) => ({ url: `/projects/${projectId}/buildings/${buildingId}` }),
				transformResponse: (response: { building: Building }) => response.building,
				providesTags: (
					_result, _error, { buildingId }
				) => [{ type: BUILDING_TAG, id: buildingId }],
			}),
			getBuildingsByProject: builder.query<Building[], string>({
				query: (projectId) => ({ url: `/projects/${projectId}/buildings` }),
				transformResponse: (response: { buildings: Building[] }) => response.buildings,
				providesTags: (
					result, _error, projectId
				) =>
					result
						? [...result.map(({ id }) => ({ type: BUILDING_TAG, id })), { type: BUILDING_TAG, id: `LIST_${projectId}` }]
						: [{ type: BUILDING_TAG, id: `LIST_${projectId}` }],
			}),
			createBuilding: builder.mutation<Building, CreateBuildingDto>({
				query: ({ projectId, ...data }) => ({ url: `/projects/${projectId}/buildings`, method: 'POST', data: { projectId, ...data } }),
				invalidatesTags: (
					_result, _error, { projectId }
				) => [
					{ type: BUILDING_TAG, id: `LIST_${projectId}` },
					{ type: PROJECT_TAG, id: projectId },
				],
			}),
			updateBuilding: builder.mutation<Building, CreateBuildingDto>({
				query: ({ projectId, id, ...data }) => ({ url: `/projects/${projectId}/buildings/${id}`, method: 'PUT', data: { projectId, id, ...data } }),
				invalidatesTags: (
					_result, _error, { id, projectId }
				) => [
					{ type: BUILDING_TAG, id },
					{ type: BUILDING_TAG, id: `LIST_${projectId}` },
					{ type: PROJECT_TAG, id: projectId },
				],
			}),
			deleteBuilding: builder.mutation<void, { id: string; projectId: string }>({
				query: ({ projectId, id }) => ({ url: `/projects/${projectId}/buildings/${id}`, method: 'DELETE' }),
				invalidatesTags: (
					_result, _error, { id, projectId }
				) => [
					{ type: BUILDING_TAG, id },
					{ type: BUILDING_TAG, id: `LIST_${projectId}` },
					{ type: PROJECT_TAG, id: projectId },
				],
			}),
		}),
	})

export const { useGetBuildingByIdQuery, useGetBuildingsByProjectQuery, useCreateBuildingMutation, useUpdateBuildingMutation, useDeleteBuildingMutation } = buildingsApi
