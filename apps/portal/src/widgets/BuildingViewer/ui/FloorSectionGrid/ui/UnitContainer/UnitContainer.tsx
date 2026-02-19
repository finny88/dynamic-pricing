import type { FC } from 'react'
import { memo } from 'react'
import { Box } from '@mantine/core'
import { UnitCell } from './UnitCell'
import { UnitCellDetailed } from './UnitCellDetailed'
import classes from './UnitContainer.module.css'
import type { Unit } from '@entities/unit'
import type { FilterOptions } from '../../model/filters'
import type { GridVariant } from '../../model/variants'
import { getUnitColors } from '../../lib/colors'
import { getUnitStatus, isUnitDisabled } from '../../lib/unit'

interface UnitContainerProps {
	items: Unit[]
	floorIndex: number
	sectionIndex: number
	activeFilters: FilterOptions
	variant?: GridVariant
}

const UnitContainerComponent: FC<UnitContainerProps> = ({
	items,
	floorIndex,
	sectionIndex,
	activeFilters,
	variant = 'compact',
}) => {
	const sizeClass = variant === 'detailed' ? classes.unitContainerDetailed : classes.unitContainerCompact
	const CellComponent = variant === 'detailed' ? UnitCellDetailed : UnitCell

	return (
		<Box
			className={`${classes.unitContainer} ${sizeClass}`}
			style={{
				gridRow: floorIndex + 2, // +2 to account for top X axis and 1-based grid
				gridColumn: sectionIndex + 2 // +2 to account for Y axis
			}}
		>
			{items.map(item => {
				const colors = getUnitColors(item)
				const status = getUnitStatus(item)
				const disabled = isUnitDisabled(item, activeFilters)

				return (
					<CellComponent
						key={item.unitNumber}
						unit={item}
						colors={colors}
						status={status}
						disabled={disabled}
					/>
				)
			})}
		</Box>
	)
}

export const UnitContainer = memo(UnitContainerComponent)