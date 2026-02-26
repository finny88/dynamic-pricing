import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionIcon, Badge, Box, Button, Card, Container, Divider, Group, Menu, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconDots, IconMapPin, IconPencil, IconPlus, IconTrash, IconBuildingSkyscraper } from '@tabler/icons-react'
import { useGetProjectsQuery, housingClassLabels, type Project } from '@entities/project'
import { CreateProjectModal, type CreateProjectModalHandle } from './CreateProjectModal'
import { DeleteProjectModal } from './DeleteProjectModal'
import { EditProjectModal } from './EditProjectModal'

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const ProjectsPage = () => {
	const { data: projects = [] } = useGetProjectsQuery()
	const navigate = useNavigate()
	const createModalRef = useRef<CreateProjectModalHandle>(null)
	const [editingProject, setEditingProject] = useState<Project | null>(null)
	const [deletingProject, setDeletingProject] = useState<Project | null>(null)

	return (
		<Container size={'xl'} pt={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
			<Group justify={'space-between'} align={'flex-start'} mb={'xl'}>
				<Stack gap={4}>
					<Title order={2}>Каталог ЖК</Title>
					<Text size={'sm'} c={'dimmed'}>
						Управление объектами и квартирографией
					</Text>
				</Stack>
				<Button leftSection={<IconPlus size={16} />} onClick={() => createModalRef.current?.open()}>
					Создать ЖК
				</Button>
			</Group>

			{projects.length === 0 ? (
				<Paper
					withBorder
					style={{ borderStyle: 'dashed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
					p={'xl'}
					mih={240}
				>
					<Stack align={'center'} gap={'md'}>
						<Box c={'gray'} h={64} w={64}>
							<IconBuildingSkyscraper size={64} stroke={1} />
						</Box>
						<Text size={'lg'} c={'dimmed'}>Проектов пока нет</Text>
						<Button variant={'outline'} leftSection={<IconPlus size={16} />} onClick={() => createModalRef.current?.open()}>
							Создать ЖК
						</Button>
					</Stack>
				</Paper>
			) : (
				<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={'md'}>
					{projects.map((project) => (
						<Card key={project.id} shadow={'sm'} padding={'lg'} radius={'md'} withBorder style={{ cursor: 'pointer' }} onClick={() => navigate(`/projects/${project.id}`)}>
							<Stack gap={'sm'}>
								<Group justify={'space-between'} align={'center'} wrap={'nowrap'}>
									<Text fw={600} size={'md'} truncate>
										{project.name}
									</Text>
									<div onClick={(e) => e.stopPropagation()}>
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
												<Menu.Item leftSection={<IconTrash size={14} />} color={'red'} onClick={() => setDeletingProject(project)}>
													Удалить
												</Menu.Item>
											</Menu.Dropdown>
										</Menu>
									</div>
								</Group>

								{(project.region || project.area || project.city) && (
									<Group gap={4} align={'center'}>
										<IconMapPin size={14} color={'gray'} />
										<Text size={'sm'} c={'dimmed'} truncate>
											{[project.region, project.area, project.city].filter(Boolean).join(', ')}
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

			<CreateProjectModal ref={createModalRef} />
			{editingProject && (
				<EditProjectModal
					project={editingProject}
					onClose={() => setEditingProject(null)}
				/>
			)}
			{deletingProject && (
				<DeleteProjectModal
					project={deletingProject}
					onClose={() => setDeletingProject(null)}
				/>
			)}
		</Container>
	)
}
