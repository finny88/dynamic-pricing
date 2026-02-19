import type { FC } from 'react'
import { Text } from '@mantine/core'
import type { Unit } from '@entities/unit'
import type { FilterOptions } from '../model/filters'
import { isUnitDisabled } from '../lib/unit'

interface ResultsCountProps {
	units: Unit[]
	activeFilters: FilterOptions
}

export const ResultsCount: FC<ResultsCountProps> = ({ units, activeFilters }) => {
	const selectedCount = units.filter(item => !isUnitDisabled(item, activeFilters)).length

	return (
		<Text size={'sm'} c={'dimmed'} ta={'center'}>
			Selected {selectedCount} units
		</Text>
	)
}
