import type { Unit } from '@entities/unit'
import type { TABS } from './constants'

export type TabValue = typeof TABS[keyof typeof TABS]

export interface TabsLayoutProps {
	units: Unit[]
}
