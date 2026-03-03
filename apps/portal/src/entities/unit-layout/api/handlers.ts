import { http, HttpResponse } from 'msw'
import { addItem, deleteItem, getAllByIndex, getById, updateItem, STORES } from '@shared/lib/db'
import type { UnitLayout } from '../model/unitLayout'

export const unitLayoutHandlers = [
	http.get<{ projectId: string; buildingId: string }>('/api/projects/:projectId/buildings/:buildingId/layouts',
		async ({ params }) => {
			const layouts = await getAllByIndex<UnitLayout>({
				storeName: STORES.UNIT_LAYOUTS,
				indexName: 'buildingId',
				value: params.buildingId,
			})
			layouts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
			return HttpResponse.json({ layouts })
		},),

	http.post<{ projectId: string; buildingId: string }, Omit<UnitLayout, 'updatedAt'>>('/api/projects/:projectId/buildings/:buildingId/layouts',
		async ({ params, request }) => {
			const body = await request.json()
			const layout: UnitLayout = {
				...body,
				buildingId: params.buildingId,
				unitNumbers: body.unitNumbers ?? [],
				updatedAt: new Date().toISOString(),
			}
			await addItem<UnitLayout>(STORES.UNIT_LAYOUTS, layout)
			return HttpResponse.json({ layout }, { status: 201 })
		},),

	http.put<{ projectId: string; buildingId: string; layoutId: string }, Omit<UnitLayout, 'updatedAt'>>('/api/projects/:projectId/buildings/:buildingId/layouts/:layoutId',
		async ({ params, request }) => {
			const body = await request.json()
			const existing = await getById<UnitLayout>(STORES.UNIT_LAYOUTS, params.layoutId)
			const layout: UnitLayout = {
				...body,
				id: params.layoutId,
				buildingId: params.buildingId,
				unitNumbers: existing?.unitNumbers ?? [],
				updatedAt: new Date().toISOString(),
			}
			await updateItem<UnitLayout>(STORES.UNIT_LAYOUTS, layout)
			return HttpResponse.json({ layout })
		},),

	http.put<{ projectId: string; buildingId: string; layoutId: string }, { unitNumbers: number[] }>('/api/projects/:projectId/buildings/:buildingId/layouts/:layoutId/units',
		async ({ params, request }) => {
			const { unitNumbers } = await request.json()

			// Uniqueness "last win": strip these unitNumbers from all other layouts
			const allLayouts = await getAllByIndex<UnitLayout>({
				storeName: STORES.UNIT_LAYOUTS,
				indexName: 'buildingId',
				value: params.buildingId,
			})
			const unitNumberSet = new Set(unitNumbers)
			for (const other of allLayouts) {
				if (other.id === params.layoutId) { continue }
				const filtered = other.unitNumbers.filter(n => !unitNumberSet.has(n))
				if (filtered.length !== other.unitNumbers.length) {
					await updateItem<UnitLayout>(STORES.UNIT_LAYOUTS, {
						...other,
						unitNumbers: filtered,
						updatedAt: new Date().toISOString(),
					})
				}
			}

			const existing = await getById<UnitLayout>(STORES.UNIT_LAYOUTS, params.layoutId)
			if (!existing) { return new HttpResponse(null, { status: 404 }) }
			const layout: UnitLayout = { ...existing, unitNumbers, updatedAt: new Date().toISOString() }
			await updateItem<UnitLayout>(STORES.UNIT_LAYOUTS, layout)
			return HttpResponse.json({ layout })
		},),

	http.delete<{ projectId: string; buildingId: string; layoutId: string }>('/api/projects/:projectId/buildings/:buildingId/layouts/:layoutId',
		async ({ params }) => {
			await deleteItem(STORES.UNIT_LAYOUTS, params.layoutId)
			return new HttpResponse(null, { status: 204 })
		},),
]
