import { Text } from '@mantine/core'
import type { FC } from 'react'
import type { Unit } from '@entities/unit'
import { isUnitDisabled } from '../lib/unit'
import type { FilterOptions } from '../model/filters'

interface ResultsCountProps {
	units: Unit[]
	activeFilters: FilterOptions
}

export const ResultsCount: FC<ResultsCountProps> = ({ units, activeFilters }) => {
	const selectedCount = units.filter(item => !isUnitDisabled(item, activeFilters)).length

	return (
		<Text size={'sm'} c={'dimmed'} ta={'center'}>
			Выбрано {selectedCount} из {units.length}
		</Text>
	)
}
