import { Table, Text } from '@mantine/core'
import type { UnitLayout } from '@entities/unit-layout'
import classes from './LayoutsTable.module.css'
import { LayoutTableRow } from './LayoutTableRow'

interface Props {
	layouts: UnitLayout[]
	onEdit: (layout: UnitLayout) => void
	onDelete: (layout: UnitLayout) => void
	onUnitSel: (layout: UnitLayout) => void
}

export const LayoutsTable = ({ layouts, onEdit, onDelete, onUnitSel }: Props) => (
	<Table verticalSpacing={'sm'} striped highlightOnHover w={'100%'} className={classes.table}>
		<Table.Thead>
			<Table.Tr className={classes.headerRow}>
				<Table.Th w={100}>Планировка</Table.Th>
				<Table.Th w={'22%'}>Наименование</Table.Th>
				<Table.Th>Помещения, соответствующие планировке</Table.Th>
				<Table.Th w={140}>Дата обновления</Table.Th>
				<Table.Th w={80} />
			</Table.Tr>
		</Table.Thead>
		<Table.Tbody>
			{layouts.length === 0 && (
				<Table.Tr>
					<Table.Td colSpan={5}>
						<Text c={'dimmed'} size={'sm'} ta={'center'} py={'md'}>
							Планировки не добавлены
						</Text>
					</Table.Td>
				</Table.Tr>
			)}
			{layouts.map(layout => (
				<LayoutTableRow
					key={layout.id}
					layout={layout}
					onEdit={onEdit}
					onDelete={onDelete}
					onUnitSel={onUnitSel}
				/>
			))}
		</Table.Tbody>
	</Table>
)
