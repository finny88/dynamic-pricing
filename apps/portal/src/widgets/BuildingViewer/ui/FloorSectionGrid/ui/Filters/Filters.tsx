import type { FC } from 'react'
import { useState } from 'react'
import { Group, Button } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { FilterGroupContext } from './FilterGroupContext'
import { SearchFilter } from './SearchFilter'
import { FloorsFilter } from './FloorsFilter'
import { SectionsFilter } from './SectionsFilter'
import { StatusFilter } from './StatusFilter'
import { RoomsFilter } from './RoomsFilter'
import { PriceFilter } from './PriceFilter'
import type { FilterOptions } from '../../model/filters'

interface FiltersProps {
	availableFloors: number[]
	availableSections: number[]
	availableRoomsCounts: string[]
	activeFilters: FilterOptions
	onFilterChange: (filters: FilterOptions) => void
}

export const Filters: FC<FiltersProps> = ({
	availableFloors,
	availableSections,
	availableRoomsCounts,
	activeFilters,
	onFilterChange,
}) => {
	const [openedId, setOpenedId] = useState<string | null>(null)

	const commitFilter = (partial: Partial<FilterOptions>) => {
		onFilterChange({ ...activeFilters, ...partial })
	}

	const handleClearAll = () => {
		onFilterChange({})
	}

	const hasActiveFilters = [
		!!activeFilters.searchQuery,
		(activeFilters.floors?.length ?? 0) > 0,
		(activeFilters.sections?.length ?? 0) > 0,
		(activeFilters.statuses?.length ?? 0) > 0,
		(activeFilters.roomsCount?.length ?? 0) > 0,
		[
			activeFilters.priceRubMin, activeFilters.priceRubMax,
			activeFilters.pricePerSqmRubMin, activeFilters.pricePerSqmRubMax,
			activeFilters.totalAreaSqmMin, activeFilters.totalAreaSqmMax
		].some(v => v !== undefined)
	].some(Boolean)

	return (
		<FilterGroupContext.Provider value={{ openedId, setOpenedId }}>
			<Group gap={'sm'} wrap={'wrap'}>
				<SearchFilter
					applied={activeFilters.searchQuery}
					onApply={(v) => commitFilter({ searchQuery: v })}
				/>
				<FloorsFilter
					applied={activeFilters.floors}
					available={availableFloors}
					onApply={(v) => commitFilter({ floors: v })}
				/>
				<SectionsFilter
					applied={activeFilters.sections}
					available={availableSections}
					onApply={(v) => commitFilter({ sections: v })}
				/>
				<StatusFilter
					applied={activeFilters.statuses}
					onApply={(v) => commitFilter({ statuses: v })}
				/>
				<RoomsFilter
					applied={activeFilters.roomsCount}
					available={availableRoomsCounts}
					onApply={(v) => commitFilter({ roomsCount: v })}
				/>
				<PriceFilter
					id={'price-total'}
					label={'Цена (₽)'}
					appliedMin={activeFilters.priceRubMin}
					appliedMax={activeFilters.priceRubMax}
					onApply={(min, max) => commitFilter({ priceRubMin: min, priceRubMax: max })}
				/>
				<PriceFilter
					id={'price-sqm'}
					label={'Цена за м² (₽)'}
					appliedMin={activeFilters.pricePerSqmRubMin}
					appliedMax={activeFilters.pricePerSqmRubMax}
					onApply={(min, max) => commitFilter({ pricePerSqmRubMin: min, pricePerSqmRubMax: max })}
				/>
				<PriceFilter
					id={'area'}
					label={'Площадь (м²)'}
					appliedMin={activeFilters.totalAreaSqmMin}
					appliedMax={activeFilters.totalAreaSqmMax}
					onApply={(min, max) => commitFilter({ totalAreaSqmMin: min, totalAreaSqmMax: max })}
				/>
				{hasActiveFilters && (
					<Button
						variant={'subtle'}
						color={'red'}
						size={'sm'}
						leftSection={<IconX size={14} />}
						onClick={handleClearAll}
					>
						Очистить
					</Button>
				)}
			</Group>
		</FilterGroupContext.Provider>
	)
}
