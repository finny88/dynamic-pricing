import type { FC } from 'react'
import { useState } from 'react'
import { Tabs, Container, Box } from '@mantine/core'
import { FloorSectionGrid } from '@widgets/FloorSectionGrid'
import { TABS, TAB_LABELS, DEFAULT_TAB } from './constants'
import type { TabsLayoutProps, TabValue } from './types'
import classes from './TabsLayout.module.css'

export const TabsLayout: FC<TabsLayoutProps> = ({ units }) => {
	const [activeTab, setActiveTab] = useState<TabValue>(DEFAULT_TAB)

	return (
		<Container size={'xxl'} p={'md'}>
			<Tabs
				value={activeTab}
				onChange={(value) => setActiveTab(value as TabValue)}
				className={classes.tabs}
			>
				<Tabs.List className={classes.tabsList}>
					<Tabs.Tab value={TABS.GRID}>
						{TAB_LABELS[TABS.GRID]}
					</Tabs.Tab>
					<Tabs.Tab value={TABS.GRID_PLUS}>
						{TAB_LABELS[TABS.GRID_PLUS]}
					</Tabs.Tab>
					<Tabs.Tab value={TABS.ROOMS}>
						{TAB_LABELS[TABS.ROOMS]}
					</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value={TABS.GRID} className={classes.tabPanel}>
					<FloorSectionGrid units={units} />
				</Tabs.Panel>

				<Tabs.Panel value={TABS.GRID_PLUS} className={classes.tabPanel}>
					<Box p={'xl'}>
						Шахматка + (placeholder)
					</Box>
				</Tabs.Panel>

				<Tabs.Panel value={TABS.ROOMS} className={classes.tabPanel}>
					<Box p={'xl'}>
						Помещения (placeholder)
					</Box>
				</Tabs.Panel>
			</Tabs>
		</Container>
	)
}
