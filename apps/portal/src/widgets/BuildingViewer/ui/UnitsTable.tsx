import { useState } from 'react'
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
	type VisibilityState,
} from '@tanstack/react-table'
import { Button, Group, Modal, Pagination, ScrollArea, SimpleGrid, Table, Text } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import type { Unit } from '@entities/unit'

const columnHelper = createColumnHelper<Unit>()

const COLUMNS = [
	columnHelper.accessor('unitNumber', { id: 'unitNumber', header: '№ помещения' }),
	columnHelper.accessor('floor', { id: 'floor', header: 'Этаж' }),
	columnHelper.accessor('section', { id: 'section', header: 'Секция' }),
	columnHelper.accessor('roomsCount', { id: 'roomsCount', header: 'Число комнат' }),
	columnHelper.accessor('totalAreaSqm', { id: 'totalAreaSqm', header: 'Общая площадь, кв. м' }),
	columnHelper.accessor('actualStatus', { id: 'actualStatus', header: 'Статус факт' }),
	columnHelper.accessor('actualTotalPriceRub', { id: 'actualTotalPriceRub', header: 'Общая цена факт, ₽' }),
	columnHelper.accessor('actualPricePerSqmRub', { id: 'actualPricePerSqmRub', header: 'Цена 1 кв. м факт, ₽' }),
	columnHelper.accessor('livingAreaSqm', { id: 'livingAreaSqm', header: 'Жилая площадь, кв. м' }),
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
	columnHelper.accessor('finishingCostPerSqmRub', { id: 'finishingCostPerSqmRub', header: 'Стоимость отделки, ₽/кв. м' }),
	columnHelper.accessor('masterBedroom', { id: 'masterBedroom', header: 'Мастер-спальня' }),
	columnHelper.accessor('walkInCloset', { id: 'walkInCloset', header: 'Гардеробная' }),
	columnHelper.accessor('bathroomsCount', { id: 'bathroomsCount', header: 'Кол-во санузлов, шт.' }),
	columnHelper.accessor('bathroomType', { id: 'bathroomType', header: 'Тип санузла' }),
	columnHelper.accessor('kitchenType', { id: 'kitchenType', header: 'Тип кухни' }),
	columnHelper.accessor('kitchenAreaSqm', { id: 'kitchenAreaSqm', header: 'Площадь кухни, кв. м' }),
	columnHelper.accessor('elevatorProximity', { id: 'elevatorProximity', header: 'Близость к лифту' }),
	columnHelper.accessor('viewType', { id: 'viewType', header: 'Вид' }),
	columnHelper.accessor('plannedConstructionCostRub', { id: 'plannedConstructionCostRub', header: 'Плановая стоимость строительства, руб' }),
	columnHelper.accessor('buyerType', { id: 'buyerType', header: 'Тип покупателя' }),
	columnHelper.accessor('buyersCount', { id: 'buyersCount', header: 'Число покупателей' }),
	columnHelper.accessor('dealType', { id: 'dealType', header: 'Тип сделки' }),
	columnHelper.accessor('initialPricePerSqmRub', { id: 'initialPricePerSqmRub', header: 'Цена кв. м на старте продаж, ₽' }),
	columnHelper.accessor('initialTotalPriceRub', { id: 'initialTotalPriceRub', header: 'Общая цена на старте, ₽' }),
	columnHelper.accessor('paymentMethod', { id: 'paymentMethod', header: 'Вариант оплаты' }),
	columnHelper.accessor('contractRegistrationDate', { id: 'contractRegistrationDate', header: 'Дата регистрации договора' }),
	columnHelper.accessor('discountAmountRub', { id: 'discountAmountRub', header: 'Размер скидки, ₽' }),
	columnHelper.accessor('specialProgramInfo', { id: 'specialProgramInfo', header: 'Информация о спецпрограммах' }),
	columnHelper.accessor('specialProgramDetails', { id: 'specialProgramDetails', header: 'Детали спецпрограммы' }),
	columnHelper.accessor('fileGeneratedDate', { id: 'fileGeneratedDate', header: 'Дата формирования файла' }),
]

// Default visible columns match REQUIRED_KEYS from rawUnitSchema
const DEFAULT_VISIBLE_IDS = new Set([
	'unitNumber', 'floor', 'section', 'roomsCount',
	'totalAreaSqm', 'actualStatus', 'actualTotalPriceRub', 'actualPricePerSqmRub',
])

const DEFAULT_COLUMN_VISIBILITY: VisibilityState = Object.fromEntries(COLUMNS.map((col) => [col.id, DEFAULT_VISIBLE_IDS.has(col.id as string)]))

const PAGE_SIZE = 10

interface Props {
	units: Unit[]
}

export const UnitsTable = ({ units }: Props) => {
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(DEFAULT_COLUMN_VISIBILITY)
	const [modalOpen, setModalOpen] = useState(false)

	const table = useReactTable({
		data: units,
		columns: COLUMNS,
		state: { columnVisibility },
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: PAGE_SIZE, pageIndex: 0 },
		},
	})

	const { pageIndex } = table.getState().pagination
	const totalPages = table.getPageCount()
	const from = (pageIndex * PAGE_SIZE) + 1
	const to = Math.min((pageIndex + 1) * PAGE_SIZE, units.length)

	return (
		<>
			<Modal
				opened={modalOpen}
				onClose={() => setModalOpen(false)}
				title={'Поля для отображения'}
				size={'lg'}
				scrollAreaComponent={ScrollArea.Autosize}
			>
				<SimpleGrid cols={3} spacing={'xs'}>
					{table.getAllLeafColumns().map((column) => {
						const isVisible = column.getIsVisible()
						return (
							<Button
								key={column.id}
								variant={isVisible ? 'filled' : 'default'}
								color={isVisible ? 'red' : undefined}
								rightSection={isVisible ? <IconCheck size={14} /> : null}
								justify={'space-between'}
								fullWidth
								size={'sm'}
								onClick={column.getToggleVisibilityHandler()}
							>
								{column.columnDef.header as string}
							</Button>
						)
					})}
				</SimpleGrid>
			</Modal>

			<Button variant={'outline'} mb={'sm'} onClick={() => setModalOpen(true)}>
				Поля для отображения
			</Button>

			<Table striped withTableBorder withColumnBorders>
				<Table.Thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<Table.Tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<Table.Th key={header.id}>
									{flexRender(header.column.columnDef.header, header.getContext())}
								</Table.Th>
							))}
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

			{units.length > 0 && (
				<Group justify={'space-between'} mt={'md'}>
					<Text size={'sm'} c={'dimmed'}>
						{from}–{to} из {units.length}
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
