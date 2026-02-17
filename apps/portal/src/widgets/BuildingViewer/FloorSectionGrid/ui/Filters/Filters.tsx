import type { FC } from 'react'
import { useState } from 'react'
import { Group, Button } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import type { FilterOptions } from '../../types'
import { FilterGroupContext } from './FilterGroupContext'
import { SearchFilter } from './SearchFilter'
import { FloorsFilter } from './FloorsFilter'
import { SectionsFilter } from './SectionsFilter'
import { StatusFilter } from './StatusFilter'
import { RoomsFilter } from './RoomsFilter'
import { PriceFilter } from './PriceFilter'

interface FiltersProps {
	availableFloors: number[]
	availableSections: number[]
	availableRoomsCounts: string[]
	onFilterChange: (filters: FilterOptions) => void
	initialFilters?: FilterOptions
}

export const Filters: FC<FiltersProps> = ({
	availableFloors,
	availableSections,
	availableRoomsCounts,
	onFilterChange,
	initialFilters = {}
}) => {
	const [appliedFilters, setAppliedFilters] = useState<FilterOptions>(initialFilters)
	const [openedId, setOpenedId] = useState<string | null>(null)

	const commitFilter = (partial: Partial<FilterOptions>) => {
		const next = { ...appliedFilters, ...partial }
		setAppliedFilters(next)
		onFilterChange(next)
	}

	const handleClearAll = () => {
		setAppliedFilters({})
		onFilterChange({})
	}

	const hasActiveFilters = [
		!!appliedFilters.searchQuery,
		(appliedFilters.floors?.length ?? 0) > 0,
		(appliedFilters.sections?.length ?? 0) > 0,
		(appliedFilters.statuses?.length ?? 0) > 0,
		(appliedFilters.roomsCount?.length ?? 0) > 0,
		appliedFilters.priceRubMin !== undefined || appliedFilters.priceRubMax !== undefined,
		appliedFilters.pricePerSqmRubMin !== undefined || appliedFilters.pricePerSqmRubMax !== undefined
	].some(Boolean)

	return (
		<FilterGroupContext.Provider value={{ openedId, setOpenedId }}>
			<Group gap={'sm'} wrap={'wrap'}>
				<SearchFilter
					applied={appliedFilters.searchQuery}
					onApply={(v) => commitFilter({ searchQuery: v })}
				/>
				<FloorsFilter
					applied={appliedFilters.floors}
					available={availableFloors}
					onApply={(v) => commitFilter({ floors: v })}
				/>
				<SectionsFilter
					applied={appliedFilters.sections}
					available={availableSections}
					onApply={(v) => commitFilter({ sections: v })}
				/>
				<StatusFilter
					applied={appliedFilters.statuses}
					onApply={(v) => commitFilter({ statuses: v })}
				/>
				<RoomsFilter
					applied={appliedFilters.roomsCount}
					available={availableRoomsCounts}
					onApply={(v) => commitFilter({ roomsCount: v })}
				/>
				<PriceFilter
					appliedMin={appliedFilters.priceRubMin}
					appliedMax={appliedFilters.priceRubMax}
					appliedSqmMin={appliedFilters.pricePerSqmRubMin}
					appliedSqmMax={appliedFilters.pricePerSqmRubMax}
					onApply={(
						min, max, sqmMin, sqmMax
					) => commitFilter({
						priceRubMin: min,
						priceRubMax: max,
						pricePerSqmRubMin: sqmMin,
						pricePerSqmRubMax: sqmMax
					})}
				/>
				{hasActiveFilters && (
					<Button
						variant={'subtle'}
						color={'red'}
						size={'sm'}
						leftSection={<IconX size={14} />}
						onClick={handleClearAll}
					>
						Clear
					</Button>
				)}
			</Group>
		</FilterGroupContext.Provider>
	)
}
