import { useNavigate } from 'react-router-dom'
import { ActionIcon, Card, Divider, Group, Menu, Stack, Text } from '@mantine/core'
import { IconDots, IconMapPin, IconPencil, IconTrash } from '@tabler/icons-react'
import type { Building } from '@entities/building'

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

interface Props {
	building: Building
	onEdit: (building: Building) => void
	onDelete: (building: Building) => void
}

export const BuildingCard = ({ building, onEdit, onDelete }: Props) => {
	const navigate = useNavigate()

	return (
		<Card
			shadow={'sm'}
			padding={'lg'}
			radius={'md'}
			withBorder
			style={{ cursor: 'pointer' }}
			onClick={() => navigate(`/projects/${building.projectId}/buildings/${building.id}`)}
		>
			<Stack gap={'sm'}>
				<Group justify={'space-between'} align={'center'} wrap={'nowrap'}>
					<Text fw={600} size={'md'} truncate>
						{building.name}
					</Text>
					<div onClick={(e) => e.stopPropagation()}>
						<Menu position={'bottom-end'} withinPortal>
							<Menu.Target>
								<ActionIcon variant={'subtle'} color={'gray'} size={'sm'}>
									<IconDots size={16} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item leftSection={<IconPencil size={14} />} onClick={() => onEdit(building)}>
									Редактировать
								</Menu.Item>
								<Menu.Item leftSection={<IconTrash size={14} />} color={'red'} onClick={() => onDelete(building)}>
									Удалить
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					</div>
				</Group>

				{building.address && (
					<Group gap={4} align={'center'}>
						<IconMapPin size={14} color={'gray'} />
						<Text size={'sm'} c={'dimmed'} truncate>
							{building.address}
						</Text>
					</Group>
				)}

				<Divider />

				<Text size={'xs'} c={'dimmed'}>
					Обновлено: {formatDate(building.updatedAt)}
				</Text>
			</Stack>
		</Card>
	)
}
