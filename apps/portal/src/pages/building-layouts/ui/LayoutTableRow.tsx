import { ActionIcon, Anchor, Group, Image, Stack, Table, Text, Tooltip } from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import type { UnitLayout } from '@entities/unit-layout'
import classes from './LayoutTableRow.module.css'

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

interface LayoutTableRowProps {
	layout: UnitLayout
	onEdit: (layout: UnitLayout) => void
	onDelete: (layout: UnitLayout) => void
	onUnitSel: (layout: UnitLayout) => void
}

export const LayoutTableRow = ({ layout, onEdit, onDelete, onUnitSel }: LayoutTableRowProps) => (
	<Table.Tr key={layout.id}>
		<Table.Td w={100}>
			<Tooltip
				label={<Image src={layout.image} alt={layout.name} w={280} fit={'contain'} />}
				position={'right'}
				withArrow
				classNames={{ tooltip: classes.imageTooltip }}
			>
				<Image
					src={layout.image}
					alt={layout.name}
					w={80}
					h={60}
					fit={'contain'}
					radius={'sm'}
					className={classes.thumbnailImage}
				/>
			</Tooltip>
		</Table.Td>
		<Table.Td className={classes.nameCell}>{layout.name}</Table.Td>
		<Table.Td>
			<Stack gap={4} align={'flex-start'}>
				{layout.unitNumbers.length > 0 ? (
					<Text size={'sm'} className={classes.unitsText}>
						{layout.unitNumbers.map(n => `№${n}`).join(', ')}
					</Text>
				) : (
					<Text size={'sm'} c={'dimmed'}>Не установлено</Text>
				)}
				<Anchor component={'button'} size={'sm'} onClick={() => onUnitSel(layout)}>
					Отметить на шахматке
				</Anchor>
			</Stack>
		</Table.Td>
		<Table.Td>{formatDate(layout.updatedAt)}</Table.Td>
		<Table.Td>
			<Group gap={'xs'} justify={'flex-end'} wrap={'nowrap'}>
				<Tooltip label={'Редактировать'}>
					<ActionIcon variant={'default'} onClick={() => onEdit(layout)}>
						<IconPencil size={16} />
					</ActionIcon>
				</Tooltip>
				<Tooltip label={'Удалить'}>
					<ActionIcon variant={'default'} color={'red'} onClick={() => onDelete(layout)}>
						<IconTrash size={16} />
					</ActionIcon>
				</Tooltip>
			</Group>
		</Table.Td>
	</Table.Tr>
)
