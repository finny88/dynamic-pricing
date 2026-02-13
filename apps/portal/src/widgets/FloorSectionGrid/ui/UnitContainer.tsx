import type { FC } from 'react'
import { Box } from '@mantine/core'
import type { Unit, FilterOptions } from '../types'
import { getUnitStatus, getUnitColors, isUnitDisabled } from '../utils'
import { UnitCell } from './UnitCell'
import classes from './UnitContainer.module.css'

interface UnitContainerProps {
	items: Unit[]
	floorIndex: number
	sectionIndex: number
	activeFilters: FilterOptions
}

export const UnitContainer: FC<UnitContainerProps> = ({ items, floorIndex, sectionIndex, activeFilters }) => {
	return (
		<Box
			className={classes.unitContainer}
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
					<UnitCell
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
