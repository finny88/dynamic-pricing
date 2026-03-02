import { Text } from '@mantine/core'
import type { FC } from 'react'
import classes from './SectionLabel.module.css'

interface SectionLabelProps {
	section: string
	sectionIndex: number
	position: 'top' | 'bottom'
	totalFloors: number
}

export const SectionLabel: FC<SectionLabelProps> = ({ section, sectionIndex, position, totalFloors }) => {
	return (
		<Text
			size={'xs'}
			c={'gray.6'}
			fw={500}
			ta={'center'}
			className={position === 'top' ? classes.topXAxisLabel : undefined}
			style={{
				gridColumn: sectionIndex + 2,
				gridRow: position === 'top' ? 1 : totalFloors + 2
			}}
		>
			{section}
		</Text>
	)
}
