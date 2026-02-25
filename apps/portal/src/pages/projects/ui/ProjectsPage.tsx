import { useState } from 'react'
import { ActionIcon, Badge, Button, Card, Center, Container, Divider, Group, Menu, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconDots, IconMapPin, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import { useGetProjectsQuery, type Project } from '@entities/project'
import { CreateProjectModal } from './CreateProjectModal'
import { EditProjectModal } from './EditProjectModal'

const housingClassLabels: Record<string, string> = {
	business: 'Бизнес',
	comfort: 'Комфорт',
	economy: 'Эконом',
	elite: 'Элит',
}

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const ProjectsPage = () => {
	const { data: projects = [] } = useGetProjectsQuery()
	const [modalOpened, setModalOpened] = useState(false)
	const [editingProject, setEditingProject] = useState<Project | null>(null)

	return (
		<Container size={'xl'} pt={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
			<Group justify={'space-between'} align={'flex-start'} mb={'xl'}>
				<Stack gap={4}>
					<Title order={2}>Каталог ЖК</Title>
					<Text size={'sm'} c={'dimmed'}>
						Управление объектами и квартирографией
					</Text>
				</Stack>
				<Button leftSection={<IconPlus size={16} />} onClick={() => setModalOpened(true)}>
					Создать ЖК
				</Button>
			</Group>

			{projects.length === 0 ? (
				<Center py={'xl'}>
					<Stack align={'center'} gap={8}>
						<Title order={3} c={'dimmed'}>Проектов пока нет</Title>
						<Text size={'sm'} c={'dimmed'}>Создайте первый ЖК</Text>
					</Stack>
				</Center>
			) : (
				<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={'md'}>
					{projects.map((project) => (
						<Card key={project.id} shadow={'sm'} padding={'lg'} radius={'md'} withBorder>
							<Stack gap={'sm'}>
								<Group justify={'space-between'} align={'center'} wrap={'nowrap'}>
									<Text fw={600} size={'md'} truncate>
										{project.name}
									</Text>
									<Menu position={'bottom-end'} withinPortal>
										<Menu.Target>
											<ActionIcon variant={'subtle'} color={'gray'} size={'sm'}>
												<IconDots size={16} />
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Item leftSection={<IconPencil size={14} />} onClick={() => setEditingProject(project)}>
												Редактировать
											</Menu.Item>
											<Menu.Item leftSection={<IconTrash size={14} />} color={'red'}>
												Удалить
											</Menu.Item>
										</Menu.Dropdown>
									</Menu>
								</Group>

								{(project.city || project.address) && (
									<Group gap={4} align={'center'}>
										<IconMapPin size={14} color={'gray'} />
										<Text size={'sm'} c={'dimmed'} truncate>
											{[project.city, project.address].filter(Boolean).join(', ')}
										</Text>
									</Group>
								)}

								<Group gap={'lg'}>
									<Text size={'sm'} c={'dimmed'}>{project.buildingsCount} корп.</Text>
									<Text size={'sm'} c={'dimmed'}>{project.lotsCount} кв.</Text>
									<Text size={'sm'} c={'dimmed'}>{project.totalArea} м²</Text>
								</Group>

								<Divider />

								<Group justify={'space-between'} align={'center'}>
									{project.housingClass && (
										<Badge variant={'outline'} color={'gray'} size={'sm'}>
											{housingClassLabels[project.housingClass] ?? project.housingClass}
										</Badge>
									)}
									<Text size={'xs'} c={'dimmed'} ml={'auto'}>
										Обновлено: {formatDate(project.updatedAt)}
									</Text>
								</Group>
							</Stack>
						</Card>
					))}
				</SimpleGrid>
			)}

			<CreateProjectModal opened={modalOpened} onClose={() => setModalOpened(false)} />
			{editingProject && (
				<EditProjectModal
					opened={!!editingProject}
					onClose={() => setEditingProject(null)}
					project={editingProject}
				/>
			)}
		</Container>
	)
}
