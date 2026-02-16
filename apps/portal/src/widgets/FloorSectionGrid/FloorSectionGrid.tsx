import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { Box, Stack, Container } from '@mantine/core'
import { ARIA_LABELS } from './constants'
import type { FloorSectionGridProps, FilterOptions } from './types'
import { computeGridData, computeAvailableFloors, computeAvailableSections } from './utils'
import { GridFilters, StatusLegend, FloorLabel, SectionLabel, UnitContainer, ResultsCount } from './ui'
import classes from './FloorSectionGrid.module.css'

const CELL_SIZE = 28

export const FloorSectionGrid: FC<FloorSectionGridProps> = ({
	units,
}) => {
	const [activeFilters, setActiveFilters] = useState<FilterOptions>({})

	// Use all units for display (no filtering, just disabling)
	const displayedUnits = units

	const { sections, floors, matrix, availableRoomsCounts } = useMemo(() => {
		return computeGridData(displayedUnits, units)
	}, [displayedUnits, units])

	// Get all available floors and sections from original units for filters
	const allFloors = useMemo(() =>
		computeAvailableFloors(units),
	[units])

	const allSections = useMemo(() =>
		computeAvailableSections(units),
	[units])

	const gridTemplateColumns = `auto repeat(${sections.length}, minmax(${CELL_SIZE}px, auto))`

	return (
		<Container size={'xxl'} p={'md'}>
			<Stack gap={'lg'}>
				{/* Filters */}
				<GridFilters
					availableFloors={allFloors}
					availableSections={allSections}
					availableRoomsCounts={availableRoomsCounts}
					onFilterChange={setActiveFilters}
					initialFilters={activeFilters}
				/>

				{/* Legend */}
				<StatusLegend />

				{/* Grid */}
				<Box className={classes.gridContainer}>
					{/* MAIN GRID */}
					<Box
						role={'grid'}
						aria-label={ARIA_LABELS.GRID}
						className={classes.grid}
						style={{
							gridTemplateColumns,
						}}
					>
						{/* Y axis - Floor labels */}
						{floors.map((floor, floorIndex) => (
							<FloorLabel
								key={floor}
								floor={floor.toString()}
								floorIndex={floorIndex}
							/>
						))}

						{/* TOP X AXIS - Section labels */}
						{sections.map((section, sectionIndex) => (
							<SectionLabel
								key={`top-${section}`}
								section={section.toString()}
								sectionIndex={sectionIndex}
								position={'top'}
								totalFloors={floors.length}
							/>
						))}

						{/* Unit cells */}
						{floors.map((floor, floorIndex) =>
							sections.map((section, sectionIndex) => {
								const items = matrix[`${floor}_${section}`] ?? []

								return (
									<UnitContainer
										key={`${floor}-${section}`}
										items={items}
										floorIndex={floorIndex}
										sectionIndex={sectionIndex}
										activeFilters={activeFilters}
									/>
								)
							}))}

						{/* BOTTOM X AXIS - Section labels */}
						{sections.map((section, sectionIndex) => (
							<SectionLabel
								key={`bottom-${section}`}
								section={section.toString()}
								sectionIndex={sectionIndex}
								position={'bottom'}
								totalFloors={floors.length}
							/>
						))}
					</Box>
				</Box>

				{/* Results count */}
				<ResultsCount units={units} activeFilters={activeFilters} />
			</Stack>
		</Container>
	)
}