import { useCallback, useMemo, useState, useTransition } from 'react'
import { IconGridDots, IconLayoutGrid, IconList } from '@tabler/icons-react'
import { Center, Container, Group, Stack, Tabs } from '@mantine/core'
import { type TabConfig } from '@shared/ui/TabsLayout'
import type { Unit } from '@entities/unit'
import type { FilterOptions } from './FloorSectionGrid/model/filters'
import { FloorSectionGrid } from './FloorSectionGrid'
import { UnitsTable } from './UnitsTable'
import { Filters } from './FloorSectionGrid/ui/Filters'
import { computeAvailableFloors, computeAvailableSections, computeGridData } from './FloorSectionGrid/lib/unit'
import { StatusLegend } from './FloorSectionGrid/ui'

type BuildingViewerTabs = 'grid' | 'grid-plus' | 'rooms'

const tabsKeys = {
	GRID: 'grid',
	GRID_PLUS: 'grid-plus',
	ROOMS: 'rooms'
} as const

interface Props {
	units: Unit[]
	mappedHeaders?: string[]
}

export const BuildingViewer = ({ units, mappedHeaders }: Props) => {
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

	const [selectedTab, setSelectedTab] = useState<BuildingViewerTabs>(tabsKeys.GRID)
	const [activeTab, setActiveTab] = useState<BuildingViewerTabs>(tabsKeys.GRID)
	const [tabsRootElement, setTabsRootElement] = useState<HTMLDivElement | null>(null)
	const [unitTableLegendElement, setUnitTableLegendElement] = useState<HTMLDivElement | null>(null)

	const buildingViewerTabsConfigs: Record<BuildingViewerTabs, TabConfig> = {
		[tabsKeys.GRID]: {
			label: 'Шахматка',
			icon: <IconGridDots size={16} />,
			legend: <StatusLegend />,
			content: <FloorSectionGrid units={units} variant={'compact'} activeFilters={activeFilters} isPending={isPending} />
		},
		[tabsKeys.GRID_PLUS]: {
			label: 'Шахматка +',
			icon: <IconLayoutGrid size={16} />,
			legend: <StatusLegend />,
			content: <FloorSectionGrid units={units} variant={'detailed'} activeFilters={activeFilters} isPending={isPending} />
		},
		[tabsKeys.ROOMS]: {
			label: 'Помещения',
			icon: <IconList size={16} />,
			legend: <div ref={setUnitTableLegendElement} />,
			content: <UnitsTable units={units} activeFilters={activeFilters} unitTableLegendElement={unitTableLegendElement} mappedHeaders={mappedHeaders} />
		}
	}

	return (
		<>
			<Container size={'xl'} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
				<Stack gap={'lg'}>
					<Filters
						availableFloors={allFloors}
						availableSections={allSections}
						availableRoomsCounts={availableRoomsCounts}
						activeFilters={activeFilters}
						onFilterChange={handleFilterChange}
					/>
					<Tabs
						value={selectedTab}
						onChange={(value) => {
							const tab = value as BuildingViewerTabs
							setSelectedTab(tab)
							startTransition(() => setActiveTab(tab))
						}}
						ref={setTabsRootElement}
					>
						<Tabs.List mb={'md'}>
							{Object.entries<TabConfig>(buildingViewerTabsConfigs).map(([key, { label, icon }]) => (
								<Tabs.Tab key={key} value={key} leftSection={icon}>
									{label}
								</Tabs.Tab>
							))}
						</Tabs.List>
					</Tabs>
					{buildingViewerTabsConfigs[activeTab].legend}
				</Stack>
			</Container>
			<Container fluid pb={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'lg' }} mt={'md'}>
				<Center>
					<Group preventGrowOverflow styles={{
						root: {
							minWidth: tabsRootElement?.clientWidth,
						},
					}}>
						{buildingViewerTabsConfigs[activeTab].content}
					</Group>
				</Center>
			</Container>
		</>
	)
}