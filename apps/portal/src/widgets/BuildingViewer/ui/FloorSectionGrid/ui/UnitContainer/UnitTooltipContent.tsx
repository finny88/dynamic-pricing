import { Box, Text, Stack, Group } from '@mantine/core'
import type { FC } from 'react'
import type { Unit } from '@entities/unit'
import { formatPrice } from '../../lib/formats'
import classes from './UnitTooltipContent.module.css'

interface UnitTooltipContentProps {
	unit: Unit
	backgroundColor: string
}

export const UnitTooltipContent: FC<UnitTooltipContentProps> = ({ unit, backgroundColor }) => {
	return (
		<Stack gap={4}>
			<Group gap={4} align={'center'} wrap={'nowrap'}>
				<Box
					className={classes.tooltipRoomsBox}
					style={{
						backgroundColor,
					}}
				>
					{unit.roomsCount}
				</Box>
				<Text size={'xs'} c={'dark'}>
					Квартира
				</Text>
				<Text size={'xs'} c={'dark'} fw={700} className={classes.unitNumber}>
					{`№${unit.unitNumber}`}
				</Text>
			</Group>
			<Group gap={4} align={'center'} wrap={'nowrap'}>
				<Text size={'lg'} fw={700} c={'dark'}>
					{`${formatPrice(unit.actualTotalPriceRub)} ₽`}
				</Text>
			</Group>
			<Group gap={4} align={'center'} wrap={'nowrap'}>
				<Text size={'xs'} c={'dimmed'}>
					{`${unit.totalAreaSqm} м²`}
				</Text>
				<Text size={'xs'} c={'dimmed'}>
					{`– ${formatPrice(unit.actualPricePerSqmRub)} ₽/м²`}
				</Text>
			</Group>
		</Stack>
	)
}
