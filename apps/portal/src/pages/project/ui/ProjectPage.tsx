import { useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
	ActionIcon,
	Badge,
	Button,
	Container,
	Divider,
	Group,
	SimpleGrid,
	Stack,
	Text,
	Title,
	Box,
	Paper,
	Skeleton,
} from '@mantine/core'
import { IconArrowLeft, IconMapPin, IconBuilding, IconPlus } from '@tabler/icons-react'
import { useGetProjectQuery, housingClassLabels } from '@entities/project'
import { useGetBuildingsByProjectQuery, type Building } from '@entities/building'
import { BuildingCard } from './BuildingCard'
import { CreateBuildingModal, type CreateBuildingModalHandle } from './CreateBuildingModal'
import { EditBuildingModal } from './EditBuildingModal'
import { DeleteBuildingModal } from './DeleteBuildingModal'

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const ProjectPage = () => {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const { data: project, isLoading, error } = useGetProjectQuery(id!, {
		skip: !id,
	})
	const createBuildingModalRef = useRef<CreateBuildingModalHandle>(null)
	const { data: buildings = [] } = useGetBuildingsByProjectQuery(id!, { skip: !id })
	const [editingBuilding, setEditingBuilding] = useState<Building | null>(null)
	const [deletingBuilding, setDeletingBuilding] = useState<Building | null>(null)

	if (isLoading) {
		return (
			<Container size={'xl'} pt={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
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

			<Divider my={'xl'} />

			{/* Buildings Section */}
			<Group justify={'space-between'} mb={'md'}>
				<Title order={4}>Корпуса</Title>
				<Button size={'sm'} leftSection={<IconPlus size={16} />} onClick={() => createBuildingModalRef.current?.open()}>Добавить корпус</Button>
			</Group>

			{project.buildingsCount === 0 ? (
				<Paper
					withBorder
					style={{ borderStyle: 'dashed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
					p={'xl'}
					mih={240}
				>
					<Stack align={'center'} gap={'md'}>
						<Group align={'center'} gap={2}>
							<IconPlus size={24} color={'gray'} />
							<Box c={'gray'}>
								<IconBuilding size={64} stroke={1} />
							</Box>
						</Group>
						<Text size={'lg'} c={'dimmed'}>Корпусов пока нет</Text>
						<Button variant={'outline'} leftSection={<IconPlus size={16} />} onClick={() => createBuildingModalRef.current?.open()}>
							Добавить корпус
						</Button>
					</Stack>
				</Paper>
			) : (
				<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={'md'}>
					{buildings.map((building) => (
						<BuildingCard key={building.id} building={building} onEdit={setEditingBuilding} onDelete={setDeletingBuilding} />
					))}
				</SimpleGrid>
			)}

			<CreateBuildingModal ref={createBuildingModalRef} projectId={id!} />
			{editingBuilding && (
				<EditBuildingModal building={editingBuilding} onClose={() => setEditingBuilding(null)} />
			)}
			{deletingBuilding && (
				<DeleteBuildingModal building={deletingBuilding} onClose={() => setDeletingBuilding(null)} />
			)}
		</Container>
	)
}
