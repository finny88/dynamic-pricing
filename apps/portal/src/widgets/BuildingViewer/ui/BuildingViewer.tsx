import { useCallback, useState, useTransition } from 'react'
import { TabsLayout, type TabConfig } from '@shared/ui/TabsLayout'
import type { Unit } from '@entities/unit'
import type { FilterOptions } from './FloorSectionGrid/model/filters'
import { FloorSectionGrid } from './FloorSectionGrid'

type BuildingViewerTabs = 'grid' | 'grid-plus' | 'rooms'

const tabsKeys = {
	GRID: 'grid',
	GRID_PLUS: 'grid-plus',
	ROOMS: 'rooms'
} as const

interface Props {
	units: Unit[]
}

export const BuildingViewer = ({ units }: Props) => {
	const [activeFilters, setActiveFilters] = useState<FilterOptions>({})
	const [isPending, startTransition] = useTransition()

	const handleFilterChange = useCallback((filters: FilterOptions) => {
		startTransition(() => {
			setActiveFilters(filters)
		})
	}, [])

	const buildingViewerTabsConfigs: Record<BuildingViewerTabs, TabConfig> = {
		[tabsKeys.GRID]: {
			label: 'Шахматка',
			content: <FloorSectionGrid units={units} variant={'compact'} activeFilters={activeFilters} onFilterChange={handleFilterChange} isPending={isPending} />
		},
		[tabsKeys.GRID_PLUS]: {
			label: 'Шахматка +',
			content: <FloorSectionGrid units={units} variant={'detailed'} activeFilters={activeFilters} onFilterChange={handleFilterChange} isPending={isPending} />
		},
		[tabsKeys.ROOMS]: {
			label: 'Помещения',
			content: 'Помещения'
		}
	}

	return <TabsLayout tabs={buildingViewerTabsConfigs} defaultTab={tabsKeys.GRID} />
}