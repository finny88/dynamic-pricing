import { Button, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconPlus, IconBuildingSkyscraper } from '@tabler/icons-react'
import { useRef, useState } from 'react'
import { useGetProjectsQuery, type Project } from '@entities/project'
import { EmptyState } from '@shared/ui/EmptyState'
import { CreateProjectModal, type CreateProjectModalHandle } from './CreateProjectModal'
import { DeleteProjectModal } from './DeleteProjectModal'
import { EditProjectModal } from './EditProjectModal'
import { ProjectCard } from './ProjectCard'

export const ProjectsPage = () => {
	const { data: projects = [] } = useGetProjectsQuery()
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
				<EmptyState
					icon={<IconBuildingSkyscraper size={64} stroke={1} />}
					message={'Проектов пока нет'}
					buttonLabel={'Создать ЖК'}
					onButtonClick={() => createModalRef.current?.open()}
				/>
			) : (
				<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={'md'}>
					{projects.map((project) => (
						<ProjectCard key={project.id} project={project} onEdit={setEditingProject} onDelete={setDeletingProject} />
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
