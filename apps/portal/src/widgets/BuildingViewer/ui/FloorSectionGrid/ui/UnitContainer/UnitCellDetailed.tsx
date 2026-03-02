import { UnstyledButton, Text, Stack, Group } from '@mantine/core'
import { clsx } from 'clsx'
import type { FC } from 'react'
import type { Unit } from '@entities/unit'
import { formatPrice } from '../../lib/formats'
import classes from './UnitCellDetailed.module.css'

interface UnitCellDetailedProps {
	unit: Unit
	colors: {
		background: string
		text: string
	}
	disabled: boolean
}

export const UnitCellDetailed: FC<UnitCellDetailedProps> = ({ unit, colors, disabled }) => {
	return (
		<UnstyledButton
			className={clsx(classes.unitButton, disabled && classes.disabled)}
			style={{
				backgroundColor: colors.background,
				borderColor: colors.background,
			}}
		>
			<Stack gap={4} className={classes.content}>
				<Group gap={4} align={'center'} wrap={'nowrap'} justify={'space-between'}>
					<Group gap={4} align={'center'} wrap={'nowrap'}>
						<Text size={'xs'} c={'white'} fw={700}>
							{unit.roomsCount}
						</Text>
						<Text size={'xs'} c={'white'}>
							Квартира
						</Text>
					</Group>
					<Text size={'xs'} c={'white'} fw={700}>
						{`№${unit.unitNumber}`}
					</Text>
				</Group>
				<Group gap={4} align={'center'} wrap={'nowrap'}>
					<Text size={'lg'} fw={700} c={'white'}>
						{`${formatPrice(unit.actualTotalPriceRub)} ₽`}
					</Text>
				</Group>
				<Group gap={4} align={'center'} wrap={'nowrap'}>
					<Text size={'xs'} c={'white'} className={classes.dimmedText}>
						{`${unit.totalAreaSqm} м²`}
					</Text>
					<Text size={'xs'} c={'white'} className={classes.dimmedText}>
						{`– ${formatPrice(unit.actualPricePerSqmRub)} ₽/м²`}
					</Text>
				</Group>
			</Stack>
		</UnstyledButton>
	)
}