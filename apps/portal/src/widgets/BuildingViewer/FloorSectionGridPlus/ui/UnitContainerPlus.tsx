import type { FC } from 'react'
import { Box } from '@mantine/core'
import type { Unit, FilterOptions } from '../../FloorSectionGrid/types'
import { getUnitColors, isUnitDisabled } from '../../FloorSectionGrid/utils'
import { UnitCellPlus } from './UnitCellPlus'
import classes from './UnitContainerPlus.module.css'

interface UnitContainerPlusProps {
	items: Unit[]
	floorIndex: number
	sectionIndex: number
	activeFilters: FilterOptions
}

export const UnitContainerPlus: FC<UnitContainerPlusProps> = ({ 
	items, 
	floorIndex, 
	sectionIndex, 
	activeFilters 
}) => {
	return (
		<Box
			className={classes.unitContainer}
			style={{
				gridRow: floorIndex + 2,
				gridColumn: sectionIndex + 2
			}}
		>
			{items.map(item => {
				const colors = getUnitColors(item)
				const disabled = isUnitDisabled(item, activeFilters)

				return (
					<UnitCellPlus
						key={item.unitNumber}
						unit={item}
						colors={colors}
						disabled={disabled}
					/>
				)
			})}
		</Box>
	)
}