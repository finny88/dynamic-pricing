import { useCallback, useMemo, useState, useTransition } from 'react'
import { IconGridDots, IconLayoutGrid, IconList } from '@tabler/icons-react'
import { Stack } from '@mantine/core'
import { TabsLayout, type TabConfig } from '@shared/ui/TabsLayout'
import type { Unit } from '@entities/unit'
import type { FilterOptions } from './FloorSectionGrid/model/filters'
import { FloorSectionGrid } from './FloorSectionGrid'
import { UnitsTable } from './UnitsTable'
import { Filters } from './FloorSectionGrid/ui/Filters'
import { computeAvailableFloors, computeAvailableSections, computeGridData } from './FloorSectionGrid/lib/unit'

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

	const allFloors = useMemo(() => computeAvailableFloors(units), [units])
	const allSections = useMemo(() => computeAvailableSections(units), [units])
	const { availableRoomsCounts } = useMemo(() => computeGridData(units, units), [units])

	const buildingViewerTabsConfigs: Record<BuildingViewerTabs, TabConfig> = {
		[tabsKeys.GRID]: {
			label: 'Шахматка',
			icon: <IconGridDots size={16} />,
			content: <FloorSectionGrid units={units} variant={'compact'} activeFilters={activeFilters} isPending={isPending} />
		},
		[tabsKeys.GRID_PLUS]: {
			label: 'Шахматка +',
			icon: <IconLayoutGrid size={16} />,
			content: <FloorSectionGrid units={units} variant={'detailed'} activeFilters={activeFilters} isPending={isPending} />
		},
		[tabsKeys.ROOMS]: {
			label: 'Помещения',
			icon: <IconList size={16} />,
			content: <UnitsTable units={units} activeFilters={activeFilters} />
		}
	}

	return (
		<Stack gap={'lg'}>
			<Filters
				availableFloors={allFloors}
				availableSections={allSections}
				availableRoomsCounts={availableRoomsCounts}
				activeFilters={activeFilters}
				onFilterChange={handleFilterChange}
			/>
			<TabsLayout tabs={buildingViewerTabsConfigs} defaultTab={tabsKeys.GRID} />
		</Stack>
	)
}