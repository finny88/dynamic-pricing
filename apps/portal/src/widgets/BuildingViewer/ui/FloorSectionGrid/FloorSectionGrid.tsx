import type { FC } from 'react'
import { useMemo } from 'react'
import { Box, Stack } from '@mantine/core'
import { FloorLabel, SectionLabel, UnitContainer, ResultsCount } from './ui'
import { clsx } from 'clsx'
import classes from './FloorSectionGrid.module.css'
import type { GridVariant } from './model/variants'
import type { Unit } from '@entities/unit'
import type { FilterOptions } from './model/filters'
import { computeGridData } from './lib/unit'
import { ARIA_LABELS } from './lib/mappers'

const VARIANT_CONFIG: Record<GridVariant, { cellMinWidth: number }> = {
	compact: { cellMinWidth: 28 },
	detailed: { cellMinWidth: 180 },
}

interface FloorSectionGridProps {
	units: Unit[]
	variant?: GridVariant
	activeFilters: FilterOptions
	isPending: boolean
}

export const FloorSectionGrid: FC<FloorSectionGridProps> = ({
	units,
	variant = 'compact',
	activeFilters,
	isPending,
}) => {

	const { sections, floors, matrix } = useMemo(() => {
		return computeGridData(units, units)
	}, [units])

	const { cellMinWidth } = VARIANT_CONFIG[variant]
	const gridTemplateColumns = `auto repeat(${sections.length}, minmax(${cellMinWidth}px, auto))`
	const gridClassName = clsx(classes.grid, variant === 'detailed' ? classes.gridDetailed : classes.gridCompact)

	return (
		<Stack gap={'lg'}>
			{/* Grid */}
			<Box
				className={classes.gridContainer}
				style={{
					opacity: isPending ? 0.6 : 1,
				}}
			>
				{/* MAIN GRID */}
				<Box
					role={'grid'}
					aria-label={ARIA_LABELS.GRID}
					className={gridClassName}
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
							variant={variant}
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
									variant={variant}
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