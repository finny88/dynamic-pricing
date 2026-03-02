import { useMemo, useState } from 'react'
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type Column,
	type SortingState,
	type VisibilityState,
} from '@tanstack/react-table'
import { Accordion, Box, Button, Group, Modal, Pagination, ScrollArea, SimpleGrid, Stack, Table, Text } from '@mantine/core'
import { IconArrowDown, IconArrowUp, IconArrowsSort, IconCheck } from '@tabler/icons-react'
import { type Unit, rawUnitSchema } from '@entities/unit'
import { getUnitColors } from './FloorSectionGrid/lib/colors'
import { formatPrice } from './FloorSectionGrid/lib/formats'
import type { FilterOptions } from './FloorSectionGrid/model/filters'
import { isUnitDisabled } from './FloorSectionGrid/lib/unit'

const columnHelper = createColumnHelper<Unit>()

const SortIcon = ({ sorted }: { sorted: false | 'asc' | 'desc' }) => {
	if (sorted === 'asc') { return <IconArrowUp size={14} style={{ flexShrink: 0 }} /> }
	if (sorted === 'desc') { return <IconArrowDown size={14} style={{ flexShrink: 0 }} /> }
	return <IconArrowsSort size={14} style={{ flexShrink: 0, opacity: 0.4 }} />
}

const COLUMNS = [
	columnHelper.accessor('unitNumber', { id: 'unitNumber', header: 'Номер квартиры' }),
	columnHelper.accessor('floor', { id: 'floor', header: 'Этаж' }),
	columnHelper.accessor('section', { id: 'section', header: 'Подъезд' }),
	columnHelper.accessor('roomsCount', { id: 'roomsCount', header: 'Количество комнат' }),
	columnHelper.accessor('totalAreaSqm', { id: 'totalAreaSqm', header: 'Общая площадь' }),
	columnHelper.accessor('actualStatus', {
		id: 'actualStatus',
		header: 'Статус',
		cell: ({ row, getValue }) => (
			<Group gap={'xs'} wrap={'nowrap'}>
				<Box style={{ width: 16, height: 16, flexShrink: 0, backgroundColor: getUnitColors(row.original).background }} />
				<span>{getValue()}</span>
			</Group>
		),
	}),
	columnHelper.accessor('actualTotalPriceRub', { id: 'actualTotalPriceRub', header: 'Общая цена', cell: ({ getValue }) => formatPrice(getValue()) }),
	columnHelper.accessor('actualPricePerSqmRub', { id: 'actualPricePerSqmRub', header: 'Цена за 1 кв.м.', cell: ({ getValue }) => formatPrice(getValue()) }),
	columnHelper.accessor('livingAreaSqm', { id: 'livingAreaSqm', header: 'Жилая площадь' }),
	columnHelper.accessor('saleDate', { id: 'saleDate', header: 'Дата продажи' }),
	columnHelper.accessor('project', { id: 'project', header: 'Проект' }),
	columnHelper.accessor('address', { id: 'address', header: 'Адрес' }),
	columnHelper.accessor('classType', { id: 'classType', header: 'Класс' }),
	columnHelper.accessor('building', { id: 'building', header: 'Корпус' }),
	columnHelper.accessor('salesStartDate', { id: 'salesStartDate', header: 'Старт продаж' }),
	columnHelper.accessor('salesEndDate', { id: 'salesEndDate', header: 'Окончание продаж' }),
	columnHelper.accessor('commissioningDate', { id: 'commissioningDate', header: 'Ввод в эксплуатацию' }),
	columnHelper.accessor('layoutType', { id: 'layoutType', header: 'Планировка, П/план' }),
	columnHelper.accessor('apartmentConfiguration', { id: 'apartmentConfiguration', header: 'Конфигурация квартиры' }),
	columnHelper.accessor('unitsPerFloor', { id: 'unitsPerFloor', header: 'Количество квартир на этаже, шт.' }),
	columnHelper.accessor('balconyOrLoggia', { id: 'balconyOrLoggia', header: 'Балкон / Лоджия' }),
	columnHelper.accessor('verandaOrTerrace', { id: 'verandaOrTerrace', header: 'Веранда / Терраса' }),
	columnHelper.accessor('ceilingHeightM', { id: 'ceilingHeightM', header: 'Высота потолков, м' }),
	columnHelper.accessor('finishing', { id: 'finishing', header: 'Отделка' }),
	columnHelper.accessor('finishingCostPerSqmRub', { id: 'finishingCostPerSqmRub', header: 'Стоимость отделки, ₽/кв. м', cell: ({ getValue }) => formatPrice(getValue()) }),
	columnHelper.accessor('masterBedroom', { id: 'masterBedroom', header: 'Мастер-спальня' }),
	columnHelper.accessor('walkInCloset', { id: 'walkInCloset', header: 'Гардеробная' }),
	columnHelper.accessor('bathroomsCount', { id: 'bathroomsCount', header: 'Кол-во санузлов, шт.' }),
	columnHelper.accessor('bathroomType', { id: 'bathroomType', header: 'Тип санузла' }),
	columnHelper.accessor('kitchenType', { id: 'kitchenType', header: 'Тип кухни' }),
	columnHelper.accessor('kitchenAreaSqm', { id: 'kitchenAreaSqm', header: 'Площадь кухни, кв. м' }),
	columnHelper.accessor('elevatorProximity', { id: 'elevatorProximity', header: 'Близость к лифту' }),
	columnHelper.accessor('viewType', { id: 'viewType', header: 'Вид' }),
	columnHelper.accessor('plannedConstructionCostRub', { id: 'plannedConstructionCostRub', header: 'Плановая стоимость строительства, руб', cell: ({ getValue }) => formatPrice(getValue()) }),
	columnHelper.accessor('buyerType', { id: 'buyerType', header: 'Тип покупателя' }),
	columnHelper.accessor('buyersCount', { id: 'buyersCount', header: 'Число покупателей' }),
	columnHelper.accessor('dealType', { id: 'dealType', header: 'Тип сделки' }),
	columnHelper.accessor('initialPricePerSqmRub', { id: 'initialPricePerSqmRub', header: 'Цена кв. м на старте продаж, ₽', cell: ({ getValue }) => formatPrice(getValue()) }),
	columnHelper.accessor('initialTotalPriceRub', { id: 'initialTotalPriceRub', header: 'Общая цена на старте, ₽', cell: ({ getValue }) => formatPrice(getValue()) }),
	columnHelper.accessor('paymentMethod', { id: 'paymentMethod', header: 'Вариант оплаты' }),
	columnHelper.accessor('contractRegistrationDate', { id: 'contractRegistrationDate', header: 'Дата регистрации договора' }),
	columnHelper.accessor('discountAmountRub', { id: 'discountAmountRub', header: 'Размер скидки, ₽', cell: ({ getValue }) => formatPrice(getValue()) }),
	columnHelper.accessor('specialProgramInfo', { id: 'specialProgramInfo', header: 'Информация о спецпрограммах' }),
	columnHelper.accessor('specialProgramDetails', { id: 'specialProgramDetails', header: 'Детали спецпрограммы' }),
	columnHelper.accessor('fileGeneratedDate', { id: 'fileGeneratedDate', header: 'Дата формирования файла' }),
]

const schemaKeys = new Set(Object.keys(rawUnitSchema.shape))
const DEFAULT_VISIBLE_IDS = new Set(COLUMNS.filter(col => typeof col.header === 'string' && schemaKeys.has(col.header)).map(col => col.id ?? ''))

const PAGE_SIZE = 10

interface Props {
	units: Unit[]
	activeFilters: FilterOptions
	modalOpen: boolean
	onModalClose: () => void
}

const ColumnToggleButton = ({ column }: { column: Column<Unit> }) => {
	const isVisible = column.getIsVisible()
	return (
		<Button
			key={column.id}
			variant={isVisible ? 'filled' : 'default'}
			color={isVisible ? 'blue' : undefined}
			rightSection={isVisible ? <IconCheck size={14} /> : null}
			justify={'space-between'}
			fullWidth
			size={'sm'}
			onClick={column.getToggleVisibilityHandler()}
		>
			{typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
		</Button>
	)
}

export const UnitsTable = ({ units, activeFilters, modalOpen, onModalClose }: Props) => {
	const filteredColumns = COLUMNS

	const filteredUnits = useMemo(() =>
		units.filter(unit => !isUnitDisabled(unit, activeFilters)),
	[units, activeFilters])

	const initialVisibility: VisibilityState = Object.fromEntries(filteredColumns.map((col) => [col.id, DEFAULT_VISIBLE_IDS.has(col.id ?? '')]))
	const [columnVisibility, setColumnVisibility] = useState(initialVisibility)
	const [sorting, setSorting] = useState<SortingState>([])

	const table = useReactTable({
		data: filteredUnits,
		columns: filteredColumns,
		defaultColumn: { sortingFn: 'alphanumeric' },
		state: { columnVisibility, sorting },
		onColumnVisibilityChange: setColumnVisibility,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: PAGE_SIZE, pageIndex: 0 },
		},
	})

	const { pageIndex } = table.getState().pagination
	const totalPages = table.getPageCount()
	const from = (pageIndex * PAGE_SIZE) + 1
	const to = Math.min((pageIndex + 1) * PAGE_SIZE, filteredUnits.length)

	const requiredColumns = table.getAllLeafColumns().filter(col => DEFAULT_VISIBLE_IDS.has(col.id))
	const extraColumns = table.getAllLeafColumns().filter(col => !DEFAULT_VISIBLE_IDS.has(col.id))

	return (
		<>
			<Modal
				opened={modalOpen}
				onClose={onModalClose}
				title={'Поля для отображения'}
				size={'lg'}
				scrollAreaComponent={ScrollArea.Autosize}
				centered
			>
				<Stack gap={'xs'}>
					<SimpleGrid cols={3} spacing={'xs'}>
						{requiredColumns.map(column => <ColumnToggleButton key={column.id} column={column} />)}
					</SimpleGrid>
					<Accordion variant={'separated'}>
						<Accordion.Item value={'extra'}>
							<Accordion.Control>Дополнительные поля</Accordion.Control>
							<Accordion.Panel>
								<SimpleGrid cols={3} spacing={'xs'}>
									{extraColumns.map(column => <ColumnToggleButton key={column.id} column={column} />)}
								</SimpleGrid>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>
				</Stack>
			</Modal>

			<Table striped withTableBorder withColumnBorders>
				<Table.Thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<Table.Tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								const sorted = header.column.getIsSorted()
								return (
									<Table.Th
										key={header.id}
										onClick={header.column.getToggleSortingHandler()}
										style={{ cursor: 'pointer', userSelect: 'none' }}
									>
										<Group gap={4} wrap={'nowrap'}>
											{flexRender(header.column.columnDef.header, header.getContext())}
											<SortIcon sorted={sorted} />
										</Group>
									</Table.Th>
								)
							})}
						</Table.Tr>
					))}
				</Table.Thead>
				<Table.Tbody>
					{table.getRowModel().rows.map((row) => (
						<Table.Tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<Table.Td key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</Table.Td>
							))}
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			{filteredUnits.length > 0 && (
				<Group justify={'space-between'} mt={'md'}>
					<Text size={'sm'} c={'dimmed'}>
						{from}–{to} из {filteredUnits.length}
					</Text>
					<Pagination
						total={totalPages}
						value={pageIndex + 1}
						onChange={(page) => table.setPageIndex(page - 1)}
					/>
				</Group>
			)}
		</>
	)
}
