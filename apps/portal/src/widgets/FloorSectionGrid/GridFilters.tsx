import type { FC } from 'react'
import { useState } from 'react'
import { Stack, TextInput, MultiSelect, Group, Button, Collapse, Box } from '@mantine/core'
import { IconSearch, IconFilter, IconX } from '@tabler/icons-react'
import type { FilterOptions, UnitStatus } from './types'

interface GridFiltersProps {
	availableFloors: number[]
	availableSections: number[]
	availableRoomsCounts: string[]
	onFilterChange: (filters: FilterOptions) => void
	initialFilters?: FilterOptions
}

export const GridFilters: FC<GridFiltersProps> = ({
	availableFloors,
	availableSections,
	availableRoomsCounts,
	onFilterChange,
	initialFilters = {}
}) => {
	const [opened, setOpened] = useState(false)
	const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || '')
	const [selectedFloors, setSelectedFloors] = useState<string[]>(initialFilters.floors?.map(String) || [])
	const [selectedSections, setSelectedSections] = useState<string[]>(initialFilters.sections?.map(String) || [])
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>(initialFilters.statuses || [])
	const [selectedRoomsCounts, setSelectedRoomsCounts] = useState<string[]>(initialFilters.roomsCount || [])

	const handleApplyFilters = () => {
		onFilterChange({
			searchQuery: searchQuery || undefined,
			floors: selectedFloors.length > 0 ? selectedFloors.map(Number) : undefined,
			sections: selectedSections.length > 0 ? selectedSections.map(Number) : undefined,
			statuses: selectedStatuses.length > 0 ? selectedStatuses as UnitStatus[] : undefined,
			roomsCount: selectedRoomsCounts.length > 0 ? selectedRoomsCounts : undefined
		})
	}

	const handleClearFilters = () => {
		setSearchQuery('')
		setSelectedFloors([])
		setSelectedSections([])
		setSelectedStatuses([])
		setSelectedRoomsCounts([])
		onFilterChange({})
	}

	const hasActiveFilters = 
		searchQuery || 
		selectedFloors.length > 0 || 
		selectedSections.length > 0 || 
		selectedStatuses.length > 0 ||
		selectedRoomsCounts.length > 0

	return (
		<Stack gap={'md'}>
			<Group gap={'sm'}>
				<TextInput
					placeholder={'Search by unit number...'}
					leftSection={<IconSearch size={16} />}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.currentTarget.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleApplyFilters()
						}
					}}
					style={{ flex: 1 }}
				/>
				<Button
					variant={opened ? 'filled' : 'light'}
					leftSection={<IconFilter size={16} />}
					onClick={() => setOpened(!opened)}
				>
					Filters
				</Button>
				{hasActiveFilters && (
					<Button
						variant={'subtle'}
						color={'red'}
						leftSection={<IconX size={16} />}
						onClick={handleClearFilters}
					>
						Clear
					</Button>
				)}
			</Group>

			<Collapse in={opened}>
				<Box p={'md'} style={{ backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: 'var(--mantine-radius-md)' }}>
					<Stack gap={'md'}>
						<Group grow>
							<MultiSelect
								label={'Floors'}
								placeholder={'Select floors'}
								data={availableFloors.map(f => ({ value: String(f), label: `Floor ${f}` }))}
								value={selectedFloors}
								onChange={setSelectedFloors}
								clearable
								searchable
							/>
							<MultiSelect
								label={'Sections'}
								placeholder={'Select sections'}
								data={availableSections.map(s => ({ value: String(s), label: `Section ${s}` }))}
								value={selectedSections}
								onChange={setSelectedSections}
								clearable
								searchable
							/>
						</Group>

						<Group grow>
							<MultiSelect
								label={'Status'}
								placeholder={'Select status'}
								data={[
									{ value: 'available', label: 'Available' },
									{ value: 'reserved', label: 'Reserved' },
									{ value: 'sold', label: 'Sold' },
									{ value: 'unknown', label: 'Unknown' }
								]}
								value={selectedStatuses}
								onChange={setSelectedStatuses}
								clearable
							/>
							<MultiSelect
								label={'Rooms'}
								placeholder={'Select rooms count'}
								data={availableRoomsCounts.map(r => ({ value: r, label: `${r} rooms` }))}
								value={selectedRoomsCounts}
								onChange={setSelectedRoomsCounts}
								clearable
								searchable
							/>
						</Group>

						<Group justify={'flex-end'}>
							<Button onClick={handleApplyFilters}>
								Apply Filters
							</Button>
						</Group>
					</Stack>
				</Box>
			</Collapse>
		</Stack>
	)
}