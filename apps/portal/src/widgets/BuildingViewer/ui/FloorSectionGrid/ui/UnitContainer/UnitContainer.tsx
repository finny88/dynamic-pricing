import { Box } from '@mantine/core'
import { clsx } from 'clsx'
import type { FC } from 'react'
import { memo } from 'react'
import type { Unit } from '@entities/unit'
import { getUnitColors } from '../../lib/colors'
import { isUnitDisabled } from '../../lib/unit'
import type { FilterOptions } from '../../model/filters'
import type { GridVariant } from '../../model/variants'
import { UnitCell } from './UnitCell'
import { UnitCellDetailed } from './UnitCellDetailed'
import { UnitCellSelection } from './UnitCellSelection'
import classes from './UnitContainer.module.css'

interface UnitContainerBaseProps {
	items: Unit[]
	floorIndex: number
	sectionIndex: number
}

interface UnitContainerViewProps extends UnitContainerBaseProps {
	selectionMode?: false
	activeFilters: FilterOptions
	variant?: GridVariant
	selectedUnitNumbers?: never
	onUnitToggle?: never
}

interface UnitContainerSelectionProps extends UnitContainerBaseProps {
	selectionMode: true
	selectedUnitNumbers: number[]
	onUnitToggle: (unitNumber: number) => void
	activeFilters?: never
	variant?: never
}

type UnitContainerProps = UnitContainerViewProps | UnitContainerSelectionProps

const UnitContainerComponent: FC<UnitContainerProps> = (props) => {
	const { items, floorIndex, sectionIndex } = props

	if (props.selectionMode) {
		const { selectedUnitNumbers, onUnitToggle } = props
		return (
			<Box
				className={clsx(classes.unitContainer, classes.unitContainerCompact)}
				style={{
					gridRow: floorIndex + 2,
					gridColumn: sectionIndex + 2,
				}}
			>
				{items.map(item => (
					<UnitCellSelection
						key={item.unitNumber}
						unit={item}
						selected={selectedUnitNumbers.includes(item.unitNumber)}
						onToggle={onUnitToggle}
					/>
				))}
			</Box>
		)
	}

	const { activeFilters, variant = 'compact' } = props
	const sizeClass = variant === 'detailed' ? classes.unitContainerDetailed : classes.unitContainerCompact
	const CellComponent = variant === 'detailed' ? UnitCellDetailed : UnitCell

	return (
		<Box
			className={clsx(classes.unitContainer, sizeClass)}
			style={{
				gridRow: floorIndex + 2, // +2 to account for top X axis and 1-based grid
				gridColumn: sectionIndex + 2 // +2 to account for Y axis
			}}
		>
			{items.map(item => {
				const colors = getUnitColors(item)
				const status = item.actualStatus
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
