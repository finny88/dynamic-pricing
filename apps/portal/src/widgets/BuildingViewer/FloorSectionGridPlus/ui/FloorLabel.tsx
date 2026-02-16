import type { FC } from 'react'
import { Box, Text } from '@mantine/core'
import classes from './FloorLabel.module.css'

interface FloorLabelProps {
	floor: string
	floorIndex: number
}

export const FloorLabel: FC<FloorLabelProps> = ({ floor, floorIndex }) => {
	return (
		<Box
			className={classes.yAxisLabel}
			style={{
				gridColumn: 1,
				gridRow: floorIndex + 2
			}}
		>
			<Text size={'xs'} c={'dimmed'} fw={500}>
				{floor}
			</Text>
		</Box>
	)
}