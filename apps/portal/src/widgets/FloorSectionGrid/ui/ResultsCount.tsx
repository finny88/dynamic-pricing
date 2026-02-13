import type { FC } from 'react'
import { Text } from '@mantine/core'
import type { Unit, FilterOptions } from '../types'
import { isUnitDisabled } from '../utils'

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
