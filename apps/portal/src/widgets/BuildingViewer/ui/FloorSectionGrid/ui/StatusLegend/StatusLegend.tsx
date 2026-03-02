import type { FC } from 'react'
import { Box, Text, Group } from '@mantine/core'
import { clsx } from 'clsx'
import classes from './StatusLegend.module.css'

export const StatusLegend: FC = () => {
	return (
		<Group gap={'md'} justify={'flex-start'}>
			<Group gap={'xs'}>
				<Box className={clsx(classes.legendBox, classes.legendBoxAvailable)} />
				<Text size={'sm'}>Свободно</Text>
			</Group>
			<Group gap={'xs'}>
				<Box className={clsx(classes.legendBox, classes.legendBoxReserved)} />
				<Text size={'sm'}>Бронь</Text>
			</Group>
			<Group gap={'xs'}>
				<Box className={clsx(classes.legendBox, classes.legendBoxSold)} />
				<Text size={'sm'}>Продано</Text>
			</Group>
			<Group gap={'xs'}>
				<Box className={clsx(classes.legendBox, classes.legendBoxUnknown)} />
				<Text size={'sm'}>Неизвестно</Text>
			</Group>
		</Group>
	)
}
