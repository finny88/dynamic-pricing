import {
	Anchor,
	Badge,
	Breadcrumbs,
	Button,
	Container,
	Divider,
	Group,
	SimpleGrid,
	Stack,
	Text,
	Title,
	Box,
	Skeleton,
} from '@mantine/core'
import { IconArrowLeft, IconBuilding, IconPlus } from '@tabler/icons-react'
import { useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useGetBuildingsByProjectQuery, type Building } from '@entities/building'
import { useGetProjectQuery, housingClassLabels } from '@entities/project'
import { EmptyState } from '@shared/ui/EmptyState'
import { LocationText } from '@shared/ui/LocationText'
import { BuildingCard } from './BuildingCard'
import { CreateBuildingModal, type CreateBuildingModalHandle } from './CreateBuildingModal'
import { DeleteBuildingModal } from './DeleteBuildingModal'
import { EditBuildingModal } from './EditBuildingModal'

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const ProjectPage = () => {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { data: project, isLoading, error } = useGetProjectQuery(id ?? '', {
		skip: !id,
	})
	const createBuildingModalRef = useRef<CreateBuildingModalHandle>(null)
	const { data: buildings = [] } = useGetBuildingsByProjectQuery(id ?? '', { skip: !id })
	const [editingBuilding, setEditingBuilding] = useState<Building | null>(null)
	const [deletingBuilding, setDeletingBuilding] = useState<Building | null>(null)

	if (isLoading) {
		return (
			<Container size={'xl'} pt={{ base: 'sm', sm: 'md', md: 'lg' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
				<Stack gap={'lg'}>
					<Skeleton h={32} w={200} />
					<Skeleton h={200} />
					<Divider />
					<Skeleton h={32} w={150} />
					<Skeleton h={240} />
				</Stack>
			</Container>
		)
	}

	if (error || !project) {
		return (
			<Container size={'xl'} pt={{ base: 'sm', sm: 'md', md: 'lg' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
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
		<Container size={'xl'} pt={{ base: 'sm', sm: 'md', md: 'lg' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
			<Stack mb={'md'} gap={'xs'}>
				<Breadcrumbs>
					<Anchor component={Link} to={'/projects'} size={'sm'}>Все ЖК</Anchor>
					<Text size={'sm'}>{project.name}</Text>
				</Breadcrumbs>
				<Group gap={'sm'} align={'center'}>
					<Stack gap={2}>
						<Title order={2}>{project.name}</Title>
						<LocationText locationParts={[project.region, project.area, project.city]} />
					</Stack>
					{project.housingClass && (
						<Badge variant={'outline'} color={'gray'} ml={'auto'}>
							{housingClassLabels[project.housingClass] ?? project.housingClass}
						</Badge>
					)}
				</Group>
			</Stack>

			<Divider mb={'md'} />

			<SimpleGrid cols={{ base: 2, sm: 4 }} spacing={'md'}>
				<Stack gap={4}>
					<Text size={'xs'} c={'dimmed'}>Домов</Text>
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

			<Divider my={'md'} />

			{/* Buildings Section */}
			<Group justify={'space-between'} mb={'md'}>
				<Title order={4}>Дома</Title>
				<Button size={'sm'} leftSection={<IconPlus size={16} />} onClick={() => createBuildingModalRef.current?.open()}>Добавить дом</Button>
			</Group>

			{project.buildingsCount === 0 ? (
				<EmptyState
					iconContent={
						<Group align={'center'} gap={2}>
							<IconPlus size={24} color={'gray'} />
							<Box c={'gray'}>
								<IconBuilding size={64} stroke={1} />
							</Box>
						</Group>
					}
					message={'Домов пока нет'}
					buttonLabel={'Добавить дом'}
					buttonLeftSection={<IconPlus size={16} />}
					onButtonClick={() => createBuildingModalRef.current?.open()}
				/>
			) : (
				<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={'md'}>
					{buildings.map((building) => (
						<BuildingCard
							key={building.id}
							building={building}
							project={project}
							onEdit={setEditingBuilding}
							onDelete={setDeletingBuilding}
						/>
					))}
				</SimpleGrid>
			)}

			<CreateBuildingModal ref={createBuildingModalRef} projectId={id ?? ''} />
			{editingBuilding && (
				<EditBuildingModal building={editingBuilding} onClose={() => setEditingBuilding(null)} />
			)}
			{deletingBuilding && (
				<DeleteBuildingModal building={deletingBuilding} onClose={() => setDeletingBuilding(null)} />
			)}
		</Container>
	)
}
