import type { ReactNode } from 'react'

export interface TabConfig {
	label: string
	content: ReactNode
	legend?: ReactNode
	icon?: ReactNode
}
