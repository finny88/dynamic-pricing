import type { FC } from 'react'
import { useState } from 'react'
import { Group, TextInput, Chip, Stack, Button, NumberInput, ScrollArea } from '@mantine/core'
import { IconSearch, IconX } from '@tabler/icons-react'
import type { FilterOptions, UnitStatus } from '../../types'
import { FilterPopover } from './FilterPopover'

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
	const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || '')

	const [draftFloors, setDraftFloors] = useState<string[]>([])
	const [draftSections, setDraftSections] = useState<string[]>([])
	const [draftStatuses, setDraftStatuses] = useState<string[]>([])
	const [draftRooms, setDraftRooms] = useState<string[]>([])
	const [draftPriceMin, setDraftPriceMin] = useState<number | string>('')
	const [draftPriceMax, setDraftPriceMax] = useState<number | string>('')

	const commitFilter = (partial: Partial<FilterOptions>) => {
		const next = { ...appliedFilters, ...partial }
		setAppliedFilters(next)
		onFilterChange(next)
	}

	const handleSearchApply = () => {
		commitFilter({ searchQuery: searchQuery || undefined })
	}

	const handleOpenFloors = () => setDraftFloors(appliedFilters.floors?.map(String) ?? [])
	const handleApplyFloors = (close: () => void) => {
		commitFilter({ floors: draftFloors.length > 0 ? draftFloors.map(Number) : undefined })
		close()
	}

	const handleOpenSections = () => setDraftSections(appliedFilters.sections?.map(String) ?? [])
	const handleApplySections = (close: () => void) => {
		commitFilter({ sections: draftSections.length > 0 ? draftSections.map(Number) : undefined })
		close()
	}

	const handleOpenStatus = () => setDraftStatuses(appliedFilters.statuses ?? [])
	const handleApplyStatus = (close: () => void) => {
		commitFilter({ statuses: draftStatuses.length > 0 ? draftStatuses as UnitStatus[] : undefined })
		close()
	}

	const handleOpenRooms = () => setDraftRooms(appliedFilters.roomsCount ?? [])
	const handleApplyRooms = (close: () => void) => {
		commitFilter({ roomsCount: draftRooms.length > 0 ? draftRooms : undefined })
		close()
	}

	const handleOpenPrice = () => {
		setDraftPriceMin(appliedFilters.priceRubMin ?? '')
		setDraftPriceMax(appliedFilters.priceRubMax ?? '')
	}
	const handleApplyPrice = (close: () => void) => {
		commitFilter({
			priceRubMin: typeof draftPriceMin === 'number' ? draftPriceMin : undefined,
			priceRubMax: typeof draftPriceMax === 'number' ? draftPriceMax : undefined
		})
		close()
	}

	const handleClearAll = () => {
		setSearchQuery('')
		setAppliedFilters({})
		onFilterChange({})
	}

	const floorsActive = (appliedFilters.floors?.length ?? 0) > 0
	const sectionsActive = (appliedFilters.sections?.length ?? 0) > 0
	const statusActive = (appliedFilters.statuses?.length ?? 0) > 0
	const roomsActive = (appliedFilters.roomsCount?.length ?? 0) > 0
	const priceActive = appliedFilters.priceRubMin !== undefined || appliedFilters.priceRubMax !== undefined

	const hasActiveFilters =
		!!appliedFilters.searchQuery ||
		[floorsActive, sectionsActive, statusActive, roomsActive, priceActive].some(Boolean)

	return (
		<Group gap={'sm'} wrap={'wrap'}>
			<TextInput
				placeholder={'Search by unit number...'}
				leftSection={<IconSearch size={16} />}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.currentTarget.value)}
				onKeyDown={(e) => { if (e.key === 'Enter') { handleSearchApply() } }}
				style={{ flex: 1, minWidth: 180 }}
			/>

			<FilterPopover
				label={floorsActive ? `Floors (${appliedFilters.floors!.length})` : 'Floors'}
				active={floorsActive}
				onOpen={handleOpenFloors}
			>
				{(close) => (
					<Stack gap={'sm'}>
						<ScrollArea.Autosize mah={200}>
							<Chip.Group multiple value={draftFloors} onChange={setDraftFloors}>
								<Group gap={'xs'} wrap={'wrap'} p={'xs'}>
									{availableFloors.map(f => (
										<Chip key={f} value={String(f)} size={'sm'}>{f}</Chip>
									))}
								</Group>
							</Chip.Group>
						</ScrollArea.Autosize>
						<Button fullWidth size={'sm'} onClick={() => handleApplyFloors(close)}>Apply</Button>
					</Stack>
				)}
			</FilterPopover>

			<FilterPopover
				label={sectionsActive ? `Sections (${appliedFilters.sections!.length})` : 'Sections'}
				active={sectionsActive}
				onOpen={handleOpenSections}
			>
				{(close) => (
					<Stack gap={'sm'}>
						<ScrollArea.Autosize mah={200}>
							<Chip.Group multiple value={draftSections} onChange={setDraftSections}>
								<Group gap={'xs'} wrap={'wrap'} p={'xs'}>
									{availableSections.map(s => (
										<Chip key={s} value={String(s)} size={'sm'}>{s}</Chip>
									))}
								</Group>
							</Chip.Group>
						</ScrollArea.Autosize>
						<Button fullWidth size={'sm'} onClick={() => handleApplySections(close)}>Apply</Button>
					</Stack>
				)}
			</FilterPopover>

			<FilterPopover
				label={statusActive ? `Status (${appliedFilters.statuses!.length})` : 'Status'}
				active={statusActive}
				onOpen={handleOpenStatus}
			>
				{(close) => (
					<Stack gap={'sm'}>
						<Chip.Group multiple value={draftStatuses} onChange={setDraftStatuses}>
							<Group gap={'xs'} wrap={'wrap'}>
								<Chip value={'available'} size={'sm'}>Available</Chip>
								<Chip value={'reserved'} size={'sm'}>Reserved</Chip>
								<Chip value={'sold'} size={'sm'}>Sold</Chip>
								<Chip value={'unknown'} size={'sm'}>Unknown</Chip>
							</Group>
						</Chip.Group>
						<Button fullWidth size={'sm'} onClick={() => handleApplyStatus(close)}>Apply</Button>
					</Stack>
				)}
			</FilterPopover>

			<FilterPopover
				label={roomsActive ? `Rooms (${appliedFilters.roomsCount!.length})` : 'Rooms'}
				active={roomsActive}
				onOpen={handleOpenRooms}
			>
				{(close) => (
					<Stack gap={'sm'}>
						<Chip.Group multiple value={draftRooms} onChange={setDraftRooms}>
							<Group gap={'xs'} wrap={'wrap'}>
								{availableRoomsCounts.map(r => (
									<Chip key={r} value={r} size={'sm'}>{r}</Chip>
								))}
							</Group>
						</Chip.Group>
						<Button fullWidth size={'sm'} onClick={() => handleApplyRooms(close)}>Apply</Button>
					</Stack>
				)}
			</FilterPopover>

			<FilterPopover
				label={'Price'}
				active={priceActive}
				onOpen={handleOpenPrice}
			>
				{(close) => (
					<Stack gap={'sm'}>
						<Group grow>
							<NumberInput
								label={'From (₽)'}
								placeholder={'Min'}
								value={draftPriceMin}
								onChange={setDraftPriceMin}
								min={0}
								thousandSeparator={' '}
								allowNegative={false}
							/>
							<NumberInput
								label={'To (₽)'}
								placeholder={'Max'}
								value={draftPriceMax}
								onChange={setDraftPriceMax}
								min={0}
								thousandSeparator={' '}
								allowNegative={false}
							/>
						</Group>
						<Button fullWidth size={'sm'} onClick={() => handleApplyPrice(close)}>Apply</Button>
					</Stack>
				)}
			</FilterPopover>

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
	)
}
