import { Box, Button, Center, Container, Stack, Tabs } from '@mantine/core'
import { useElementSize, useId } from '@mantine/hooks'
import { IconGridDots, IconLayoutGrid, IconList } from '@tabler/icons-react'
import { useCallback, useMemo, useState, useTransition } from 'react'
import type { Unit } from '@entities/unit'
import { type TabConfig } from '@shared/ui/TabsLayout'
import classes from './BuildingViewer.module.css'
import { FloorSectionGrid } from './FloorSectionGrid'
import { computeAvailableFloors, computeAvailableRoomsCounts, computeAvailableSections } from './FloorSectionGrid/lib/unit'
import type { FilterOptions } from './FloorSectionGrid/model/filters'
import { StatusLegend } from './FloorSectionGrid/ui'
import { Filters } from './FloorSectionGrid/ui/Filters'
import { UnitsTable } from './UnitsTable'

type BuildingViewerTabs = 'grid' | 'grid-plus' | 'rooms'

const tabsKeys = {
	GRID: 'grid',
	GRID_PLUS: 'grid-plus',
	ROOMS: 'rooms'
} as const

const isBuildingViewerTab = (value: string | null): value is BuildingViewerTabs =>
	value === tabsKeys.GRID || value === tabsKeys.GRID_PLUS || value === tabsKeys.ROOMS

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
	const availableRoomsCounts = useMemo(() => computeAvailableRoomsCounts(units), [units])

	const [selectedTab, setSelectedTab] = useState<BuildingViewerTabs>(tabsKeys.GRID)
	const [activeTab, setActiveTab] = useState<BuildingViewerTabs>(tabsKeys.GRID)
	const { ref: tabsRef, width: tabsWidth } = useElementSize()
	const tabsBaseId = useId()
	const [columnModalOpen, setColumnModalOpen] = useState(false)

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
			legend: <Button variant={'outline'} className={classes.legendButton} onClick={() => setColumnModalOpen(true)}>Поля для отображения</Button>,
			content: <UnitsTable
				units={units}
				activeFilters={activeFilters}
				modalOpen={columnModalOpen}
				onModalClose={() => setColumnModalOpen(false)}
			/>
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
							if (!isBuildingViewerTab(value)) { return }
							setSelectedTab(value)
							startTransition(() => setActiveTab(value))
						}}
						ref={tabsRef}
					>
						<Tabs.List mb={'md'}>
							{Object.entries<TabConfig>(buildingViewerTabsConfigs).map(([key, { label, icon }]) => (
								<Tabs.Tab key={key} value={key} id={`${tabsBaseId}-tab-${key}`} leftSection={icon}>
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
					<Box
						role={'tabpanel'}
						id={`${tabsBaseId}-panel-${activeTab}`}
						aria-labelledby={`${tabsBaseId}-tab-${activeTab}`}
						tabIndex={0}
						style={{ minWidth: tabsWidth }}
					>
						{buildingViewerTabsConfigs[activeTab].content}
					</Box>
				</Center>
			</Container>
		</>
	)
}