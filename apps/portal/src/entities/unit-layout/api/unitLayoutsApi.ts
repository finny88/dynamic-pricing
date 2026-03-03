import { rootApi } from '@shared/api'
import type { UnitLayout, CreateUnitLayoutDto, UpdateUnitLayoutDto, UpdateUnitLayoutUnitsDto } from '../model/unitLayout'

const UNIT_LAYOUT_TAG = 'UnitLayout' as const

export const unitLayoutsApi = rootApi
	.enhanceEndpoints({ addTagTypes: [UNIT_LAYOUT_TAG] })
	.injectEndpoints({
		endpoints: (builder) => ({
			getLayoutsByBuilding: builder.query<UnitLayout[], { projectId: string; buildingId: string }>({
				query: ({ projectId, buildingId }) => ({ url: `/projects/${projectId}/buildings/${buildingId}/layouts` }),
				transformResponse: (response: { layouts: UnitLayout[] }) => response.layouts,
				// eslint-disable-next-line max-params
				providesTags: (
					_result, _error, { buildingId }
				) => [{ type: UNIT_LAYOUT_TAG, id: `LIST_${buildingId}` }],
			}),
			createLayout: builder.mutation<UnitLayout, { projectId: string; buildingId: string; dto: Omit<CreateUnitLayoutDto, 'buildingId'> }>({
				query: ({ projectId, buildingId, dto }) => ({
					url: `/projects/${projectId}/buildings/${buildingId}/layouts`,
					method: 'POST',
					data: { ...dto, buildingId },
				}),
				// eslint-disable-next-line max-params
				invalidatesTags: (
					_result, _error, { buildingId }
				) => [{ type: UNIT_LAYOUT_TAG, id: `LIST_${buildingId}` }],
			}),
			updateLayout: builder.mutation<UnitLayout, { projectId: string; buildingId: string; layoutId: string; dto: Omit<UpdateUnitLayoutDto, 'buildingId'> }>({
				query: ({ projectId, buildingId, layoutId, dto }) => ({
					url: `/projects/${projectId}/buildings/${buildingId}/layouts/${layoutId}`,
					method: 'PUT',
					data: { ...dto, buildingId },
				}),
				// eslint-disable-next-line max-params
				invalidatesTags: (
					_result, _error, { buildingId }
				) => [{ type: UNIT_LAYOUT_TAG, id: `LIST_${buildingId}` }],
			}),
			updateLayoutUnits: builder.mutation<UnitLayout, { projectId: string; buildingId: string; layoutId: string; unitNumbers: number[] }>({
				query: ({ projectId, buildingId, layoutId, unitNumbers }) => ({
					url: `/projects/${projectId}/buildings/${buildingId}/layouts/${layoutId}/units`,
					method: 'PUT',
					data: { unitNumbers } satisfies Pick<UpdateUnitLayoutUnitsDto, 'unitNumbers'>,
				}),
				// eslint-disable-next-line max-params
				invalidatesTags: (
					_result, _error, { buildingId }
				) => [{ type: UNIT_LAYOUT_TAG, id: `LIST_${buildingId}` }],
			}),
			deleteLayout: builder.mutation<void, { projectId: string; buildingId: string; layoutId: string }>({
				query: ({ projectId, buildingId, layoutId }) => ({
					url: `/projects/${projectId}/buildings/${buildingId}/layouts/${layoutId}`,
					method: 'DELETE',
				}),
				// eslint-disable-next-line max-params
				invalidatesTags: (
					_result, _error, { buildingId }
				) => [{ type: UNIT_LAYOUT_TAG, id: `LIST_${buildingId}` }],
			}),
		}),
	})

export const {
	useGetLayoutsByBuildingQuery,
	useCreateLayoutMutation,
	useUpdateLayoutMutation,
	useUpdateLayoutUnitsMutation,
	useDeleteLayoutMutation,
} = unitLayoutsApi
