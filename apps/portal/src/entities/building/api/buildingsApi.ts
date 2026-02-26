import { rootApi } from '@shared/api'
import { PROJECT_TAG } from '@entities/project/@x/building'
import type { Building } from '../model/building'

export type CreateBuildingDto = Omit<Building, 'updatedAt'>

const BUILDING_TAG = 'Building' as const

export const buildingsApi = rootApi
	.enhanceEndpoints({ addTagTypes: [BUILDING_TAG, PROJECT_TAG] })
	.injectEndpoints({
		endpoints: (builder) => ({
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
		}),
	})

export const { useGetBuildingsByProjectQuery, useCreateBuildingMutation } = buildingsApi
