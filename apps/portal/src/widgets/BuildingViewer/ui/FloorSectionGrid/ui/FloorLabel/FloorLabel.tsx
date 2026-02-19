import type { FC } from 'react'
import { Box, Text } from '@mantine/core'
import classes from './FloorLabel.module.css'
import type { GridVariant } from '../../model/variants'

interface FloorLabelProps {
	floor: string
	floorIndex: number
	variant?: GridVariant
}

export const FloorLabel: FC<FloorLabelProps> = ({ floor, floorIndex, variant = 'compact' }) => {
	const sizeClass = variant === 'detailed' ? classes.yAxisLabelDetailed : classes.yAxisLabelCompact

	return (
		<Box
			className={`${classes.yAxisLabel} ${sizeClass}`}
			style={{
				gridColumn: 1,
				gridRow: floorIndex + 2 // +2 to account for top X axis and 1-based grid
			}}
		>
			<Text size={'xs'} c={'dimmed'} fw={500}>
				{floor}
			</Text>
		</Box>
	)
}
