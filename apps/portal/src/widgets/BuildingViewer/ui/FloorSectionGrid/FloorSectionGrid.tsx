import { Box, Stack } from '@mantine/core'
import { clsx } from 'clsx'
import { useMemo } from 'react'
import type { FC } from 'react'
import type { Unit } from '@entities/unit'
import classes from './FloorSectionGrid.module.css'
import { ARIA_LABELS } from './lib/aria'
import { computeGridData } from './lib/unit'
import type { FilterOptions } from './model/filters'
import type { GridVariant } from './model/variants'
import { FloorLabel, SectionLabel, UnitContainer, ResultsCount } from './ui'

const VARIANT_CONFIG: Record<GridVariant, { cellMinWidth: number }> = {
	compact: { cellMinWidth: 28 },
	detailed: { cellMinWidth: 180 },
}

interface FloorSectionGridViewProps {
	units: Unit[]
	variant?: GridVariant
	activeFilters: FilterOptions
	isPending: boolean
	selectionMode?: false
	selectedUnitNumbers?: never
	onSelectionChange?: never
}

interface FloorSectionGridSelectionProps {
	units: Unit[]
	selectionMode: true
	selectedUnitNumbers: number[]
	onSelectionChange: (unitNumbers: number[]) => void
	variant?: never
	activeFilters?: never
	isPending?: never
}

type FloorSectionGridProps = FloorSectionGridViewProps | FloorSectionGridSelectionProps

export const FloorSectionGrid: FC<FloorSectionGridProps> = (props) => {
	const { units } = props

	const { sections, floors, matrix } = useMemo(() => {
		return computeGridData(units)
	}, [units])

	const isSelection = props.selectionMode === true

	const cellMinWidth = isSelection ? 34 : VARIANT_CONFIG[props.variant ?? 'compact'].cellMinWidth
	const gridTemplateColumns = `auto repeat(${sections.length}, minmax(${cellMinWidth}px, auto))`
	const gridClassName = clsx(
		classes.grid,
		!isSelection && (props.variant === 'detailed' ? classes.gridDetailed : classes.gridCompact),
		isSelection && classes.gridCompact,
		isSelection && classes.gridSelection,
	)

	return (
		<Stack gap={'lg'}>
			{/* Grid */}
			<Box
				className={classes.gridContainer}
				style={{
					opacity: (!isSelection && props.isPending) ? 0.6 : 1,
				}}
			>
				{/* MAIN GRID */}
				<Box
					role={'grid'}
					aria-label={ARIA_LABELS.GRID}
					className={gridClassName}
					style={{ gridTemplateColumns }}
				>
					{/* Y axis - Floor labels */}
					{floors.map((floor, floorIndex) => (
						<FloorLabel
							key={floor}
							floor={floor.toString()}
							floorIndex={floorIndex}
							variant={isSelection ? 'compact' : (props.variant ?? 'compact')}
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

							if (isSelection) {
								const { selectedUnitNumbers, onSelectionChange } = props
								const onUnitToggle = (unitNumber: number) => {
									const next = selectedUnitNumbers.includes(unitNumber)
										? selectedUnitNumbers.filter(n => n !== unitNumber)
										: [...selectedUnitNumbers, unitNumber]
									onSelectionChange(next)
								}
								return (
									<UnitContainer
										key={`${floor}-${section}`}
										items={items}
										floorIndex={floorIndex}
										sectionIndex={sectionIndex}
										selectionMode={true}
										selectedUnitNumbers={selectedUnitNumbers}
										onUnitToggle={onUnitToggle}
									/>
								)
							}

							return (
								<UnitContainer
									key={`${floor}-${section}`}
									items={items}
									floorIndex={floorIndex}
									sectionIndex={sectionIndex}
									activeFilters={props.activeFilters}
									variant={props.variant}
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

			{/* Results count (view mode only) */}
			{props.selectionMode !== true && (
				<ResultsCount units={units} activeFilters={props.activeFilters} />
			)}
		</Stack>
	)
}
