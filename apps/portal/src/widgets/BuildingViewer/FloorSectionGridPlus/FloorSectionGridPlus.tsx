import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { Box, Stack } from '@mantine/core'
import type { Unit } from '@entities/unit'
import type { FilterOptions } from '../FloorSectionGrid/types'
import { 
	computeGridData, 
	computeAvailableFloors, 
	computeAvailableSections 
} from '../FloorSectionGrid/utils'
import { GridFilters, StatusLegend, ResultsCount } from '../FloorSectionGrid/ui'
import { FloorLabel, SectionLabel, UnitContainerPlus } from './ui'
import classes from './FloorSectionGridPlus.module.css'

interface FloorSectionGridPlusProps {
	units: Unit[]
}

export const FloorSectionGridPlus: FC<FloorSectionGridPlusProps> = ({ units }) => {
	const [activeFilters, setActiveFilters] = useState<FilterOptions>({})

	const displayedUnits = units

	const { sections, floors, matrix, availableRoomsCounts } = useMemo(() => {
		return computeGridData(displayedUnits, units)
	}, [displayedUnits, units])

	const allFloors = useMemo(() => computeAvailableFloors(units), [units])
	const allSections = useMemo(() => computeAvailableSections(units), [units])

	// Larger cells for plus view - approximately 180px wide
	const gridTemplateColumns = `auto repeat(${sections.length}, minmax(180px, auto))`

	return (
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
				<Box
					role={'grid'}
					aria-label={'Floor section grid plus display'}
					className={classes.grid}
					style={{ gridTemplateColumns }}
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
								<UnitContainerPlus
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
	)
}