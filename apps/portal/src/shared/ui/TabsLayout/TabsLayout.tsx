import type { ReactNode } from 'react'
import { useState } from 'react'
import { Tabs, Container } from '@mantine/core'
import classes from './TabsLayout.module.css'

export interface TabConfig {
	label: string
	content: ReactNode
	icon?: ReactNode
}

interface Props<T extends string> {
	tabs: Record<T, TabConfig>
	defaultTab: T
}

export const TabsLayout = <T extends string>({ tabs, defaultTab }: Props<T>) => {
	const [activeTab, setActiveTab] = useState<T>(defaultTab)

	return (
		<Container size={'xxl'} p={'md'}>
			<Tabs
				value={activeTab}
				onChange={(value) => setActiveTab(value as T)}
				className={classes.tabs}
			>
				<Tabs.List className={classes.tabsList}>
					{Object.entries<TabConfig>(tabs).map(([key, { label, icon }]) => (
						<Tabs.Tab key={key} value={key} leftSection={icon}>
							{label}
						</Tabs.Tab>
					))}
				</Tabs.List>

				{Object.entries<TabConfig>(tabs).map(([key, { content }]) => (
					<Tabs.Panel key={key} value={key} className={classes.tabPanel} keepMounted>
						{content}
					</Tabs.Panel>
				))}
			</Tabs>
		</Container>
	)
}
