import { TabsLayout, type TabConfig } from '@shared/ui/TabsLayout'
import type { Unit } from '@entities/unit'
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
	const buildingViewerTabsConfigs: Record<BuildingViewerTabs, TabConfig> = {
		[tabsKeys.GRID]: {
			label: 'Шахматка',
			content: <FloorSectionGrid units={units} variant={'compact'} />
		},
		[tabsKeys.GRID_PLUS]: {
			label: 'Шахматка +',
			content: <FloorSectionGrid units={units} variant={'detailed'} />
		},
		[tabsKeys.ROOMS]: {
			label: 'Помещения',
			content: 'Помещения'
		}
	}
  
	return <TabsLayout tabs={buildingViewerTabsConfigs} defaultTab={tabsKeys.GRID} />
}