import { TabsLayout, type TabConfig } from '@shared/ui/TabsLayout'
import type { Unit } from '@entities/unit'
import { FloorSectionGrid } from './FloorSectionGrid'
import { FloorSectionGridPlus } from './FloorSectionGridPlus'

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
			content: <FloorSectionGrid units={units} />
		},
		[tabsKeys.GRID_PLUS]: {
			label: 'Шахматка +',
			content: <FloorSectionGridPlus units={units} />
		},
		[tabsKeys.ROOMS]: {
			label: 'Помещения',
			content: 'Помещения'
		}
	}
  
	return <TabsLayout tabs={buildingViewerTabsConfigs} defaultTab={tabsKeys.GRID} />
}