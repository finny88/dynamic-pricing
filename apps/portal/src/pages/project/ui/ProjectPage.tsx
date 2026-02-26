import { useParams, useNavigate } from 'react-router-dom'
import { ActionIcon, Badge, Button, Container, Divider, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconArrowLeft, IconMapPin } from '@tabler/icons-react'
import { useGetProjectsQuery, housingClassLabels } from '@entities/project'

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const ProjectPage = () => {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { data: projects = [] } = useGetProjectsQuery()
	const project = projects.find((p) => p.id === id)

	if (!project) {
		return (
			<Container size={'xl'} pt={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
				<Stack align={'center'} pt={'xl'} gap={8}>
					<Title order={3} c={'dimmed'}>Проект не найден</Title>
					<Button variant={'subtle'} leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/projects')}>
						Вернуться к каталогу
					</Button>
				</Stack>
			</Container>
		)
	}

	return (
		<Container size={'xl'} pt={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
			<Group mb={'xl'} gap={'sm'}>
				<ActionIcon variant={'subtle'} color={'gray'} onClick={() => navigate('/projects')}>
					<IconArrowLeft size={18} />
				</ActionIcon>
				<Stack gap={2}>
					<Title order={2}>{project.name}</Title>
					{(project.region || project.area || project.city) && (
						<Group gap={4} align={'center'}>
							<IconMapPin size={14} color={'gray'} />
							<Text size={'sm'} c={'dimmed'}>
								{[project.region, project.area, project.city].filter(Boolean).join(', ')}
							</Text>
						</Group>
					)}
				</Stack>
				{project.housingClass && (
					<Badge variant={'outline'} color={'gray'} ml={'auto'}>
						{housingClassLabels[project.housingClass] ?? project.housingClass}
					</Badge>
				)}
			</Group>

			<Divider mb={'xl'} />

			<SimpleGrid cols={{ base: 2, sm: 4 }} spacing={'md'}>
				<Stack gap={4}>
					<Text size={'xs'} c={'dimmed'}>Корпусов</Text>
					<Text fw={600} size={'lg'}>{project.buildingsCount}</Text>
				</Stack>
				<Stack gap={4}>
					<Text size={'xs'} c={'dimmed'}>Квартир</Text>
					<Text fw={600} size={'lg'}>{project.lotsCount}</Text>
				</Stack>
				<Stack gap={4}>
					<Text size={'xs'} c={'dimmed'}>Общая площадь</Text>
					<Text fw={600} size={'lg'}>{project.totalArea} м²</Text>
				</Stack>
				<Stack gap={4}>
					<Text size={'xs'} c={'dimmed'}>Обновлено</Text>
					<Text fw={600} size={'lg'}>{formatDate(project.updatedAt)}</Text>
				</Stack>
			</SimpleGrid>
		</Container>
	)
}
