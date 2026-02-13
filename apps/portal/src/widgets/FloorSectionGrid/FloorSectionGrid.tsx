import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { Box, Text, UnstyledButton, Stack, Group, Container, Tooltip } from '@mantine/core'
import { ARIA_LABELS } from './constants'
import { GridFilters } from './GridFilters'
import type { FloorSectionGridProps, FilterOptions } from './types'
import {
	getUnitStatus,
	computeGridData,
	computeAvailableFloors,
	computeAvailableSections,
	isUnitDisabled,
	getUnitColors
} from './utils'
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
		<Container size={'xl'} p={'md'}>
			<Stack gap={'lg'}>
				{/* Filters */}
				<GridFilters
					availableFloors={allFloors}
					availableSections={allSections}
					availableRoomsCounts={availableRoomsCounts}
					onFilterChange={setActiveFilters}
					initialFilters={activeFilters}
				/>

				{/* Grid */}
				<Group align={'flex-start'} className={classes.yAxis} wrap={'nowrap'}>
					{/* Y axis - Floor labels */}
					<Stack gap={0}>
						{/* Spacer for top X axis */}
						<Box className={classes.yAxisSpacer} />

						

						{/* Spacer for bottom X axis */}
						<Box className={classes.yAxisSpacer} />
					</Stack>

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
								<Box
									key={floor}
									className={classes.yAxisLabel}
									style={{
										gridColumn: 1,
										gridRow: floorIndex + 2 // +2 to account for top X axis and 1-based grid
									}}
								>
									<Text size={'xs'} c={'dimmed'} fw={500}>
										{floor}
									</Text>
								</Box>
							))}

							{/* TOP X AXIS - Section labels */}
							{sections.map((section, sectionIndex) => (
								<Text
									key={`top-${section}`}
									size={'xs'}
									c={'gray.6'}
									fw={500}
									ta={'center'}
									className={classes.topXAxisLabel}
									style={{ gridColumn: sectionIndex + 2 }}
								>
									{section}
								</Text>
							))}

							{floors.map((floor, floorIndex) =>
								sections.map((section, sectionIndex) => {
									const items = matrix[`${floor}_${section}`] ?? []

									return (
										<Box
											key={`${floor}-${section}`}
											className={classes.unitContainer}
											style={{
												gridRow: floorIndex + 2, // +2 to account for top X axis and 1-based grid
												gridColumn: sectionIndex + 2 // +1 to account for Y axis
											}}
										>
											{items.map(item => {
												const colors = getUnitColors(item)
												const status = getUnitStatus(item)
												const disabled = isUnitDisabled(item, activeFilters)

												const formatPrice = (price: string) => {
													const cleanPrice = price.replace(/,/g, '')
													const num = parseFloat(cleanPrice)
													if (isNaN(num)) {
														return price
													}
													return Math.round(num).toLocaleString('ru-RU').replace(/,/g, ' ')
												}

												return (
													<Tooltip
														key={item.unitNumber}
														color={'white'}
														label={
															<Stack gap={4}>
																<Group gap={4} align={'center'} wrap={'nowrap'}>
																	<Box
																		className={classes.tooltipRoomsBox}
																		style={{
																			backgroundColor: colors.background,
																		}}
																	>
																		{item.roomsCount}
																	</Box>
																	<Text size={'xs'} c={'dark'}>
																		Квартира
																	</Text>
																	<Text size={'xs'} c={'dark'} fw={700} style={{ marginLeft: 4 }}>
																		{`№${item.unitNumber}`}
																	</Text>
																</Group>
																<Group gap={4} align={'center'} wrap={'nowrap'}>
																	<Text size={'lg'} fw={700} c={'dark'}>
																		{`${formatPrice(item.actualTotalPriceRub)} ₽`}
																	</Text>
																</Group>
																<Group gap={4} align={'center'} wrap={'nowrap'}>
																	<Text size={'xs'} c={'dimmed'}>
																		{`${item.totalAreaSqm} м²`}
																	</Text>
																	<Text size={'xs'} c={'dimmed'}>
																		{`– ${formatPrice(item.actualPricePerSqmRub)} ₽/м²`}
																	</Text>
																</Group>
															</Stack>
														}
														withArrow
														position={'top'}
														styles={{
															tooltip: {
																zIndex: 10000,
																opacity: 1,
																backgroundColor: 'white',
																boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
																border: 'none',
															}
														}}
													>
														<UnstyledButton
															aria-label={`${ARIA_LABELS.UNIT} ${item.unitNumber} - ${status}${disabled ? ' (filtered)' : ''}`}
															className={`${classes.unitButton} ${disabled ? classes.disabled : ''}`}
															style={{
																backgroundColor: colors.background,
																opacity: disabled ? 0.3 : 1,
																cursor: disabled ? 'not-allowed' : 'pointer',
															}}
															onMouseEnter={(e) => {
																if (!disabled && colors.hoverBackground) {
																	e.currentTarget.style.backgroundColor = colors.hoverBackground
																}
															}}
															onMouseLeave={(e) => {
																if (!disabled) {
																	e.currentTarget.style.backgroundColor = colors.background
																}
															}}
														>
															{item.roomsCount}
														</UnstyledButton>
													</Tooltip>
												)
											})}
										</Box>
									)
								}))}

							{/* BOTTOM X AXIS - Section labels */}
							{sections.map((section, sectionIndex) => (
								<Text
									key={`bottom-${section}`}
									size={'xs'}
									c={'gray.6'}
									fw={500}
									ta={'center'}
									style={{ gridRow: floors.length + 2, gridColumn: sectionIndex + 2 }}
								>
									{section}
								</Text>
							))}
						</Box>
					</Box>
				</Group>

				{/* Results count */}
				<Text size={'sm'} c={'dimmed'} ta={'center'}>
					Selected {units.filter(item => !isUnitDisabled(item, activeFilters)).length} units
				</Text>
			</Stack>
		</Container>
	)
}