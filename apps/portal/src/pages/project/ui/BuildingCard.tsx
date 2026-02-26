import { useNavigate } from 'react-router-dom'
import { Card, Divider, Group, Stack, Text } from '@mantine/core'
import { IconMapPin } from '@tabler/icons-react'
import type { Building } from '@entities/building'

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const BuildingCard = ({ building }: { building: Building }) => {
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
				<Text fw={600} size={'md'} truncate>
					{building.name}
				</Text>

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
