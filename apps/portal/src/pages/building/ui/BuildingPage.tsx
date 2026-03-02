import { Activity, useState, useTransition } from 'react'
import { useParams, useNavigate, useLocation, type Location } from 'react-router-dom'
import {
	Button,
	Container,
	Divider,
	Group,
	SimpleGrid,
	Skeleton,
	Stack,
	Text,
	Title,
	Tooltip,
} from '@mantine/core'
import { IconArrowLeft, IconEye, IconEyeOff, IconFileUpload } from '@tabler/icons-react'
import { useGetBuildingByIdQuery, BuildingPageHeader, type BuildingPageInitialState } from '@entities/building'
import { useGetProjectQuery } from '@entities/project'
import { BuildingViewer } from '@widgets/BuildingViewer'

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const BuildingPage = () => {
	const { projectId, buildingId } = useParams<{ projectId: string; buildingId: string }>()
	const navigate = useNavigate()
	const { state }: Location<BuildingPageInitialState | null> = useLocation()
	const [showViewer, setShowViewer] = useState(state?.showViewer === true)
	const [isPending, startTransition] = useTransition()

	const { data: building = null, isLoading, error } = useGetBuildingByIdQuery({ projectId: projectId ?? '', buildingId: buildingId ?? '' }, { skip: !projectId || !buildingId })
	const { data: project } = useGetProjectQuery(projectId ?? '', { skip: !projectId })

	if (isLoading) {
		return (
			<Container size={'xl'} pt={{ base: 'sm', sm: 'md', md: 'lg' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
				<Stack gap={'lg'}>
					<Skeleton h={32} w={200} />
					<Skeleton h={80} />
					<Divider />
					<Skeleton h={400} />
				</Stack>
			</Container>
		)
	}

	if (error || !building) {
		return (
			<Container size={'xl'} pt={{ base: 'sm', sm: 'md', md: 'lg' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
				<Stack align={'center'} pt={'xl'} gap={8}>
					<Title order={3} c={'dimmed'}>Корпус не найден</Title>
					<Button variant={'subtle'} leftSection={<IconArrowLeft size={16} />} onClick={() => navigate(`/projects/${projectId}`)}>
						Вернуться к проекту
					</Button>
				</Stack>
			</Container>
		)
	}

	return (
		<>
			<Container size={'xl'} pt={{ base: 'sm', sm: 'md', md: 'lg' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
				<BuildingPageHeader building={building} projectId={projectId ?? ''} projectName={project?.name ?? ''} />

				<Group justify={'space-between'} align={'flex-end'}>
					<SimpleGrid cols={{ base: 2, sm: 4 }} spacing={'md'}>
						<Stack gap={4}>
							<Text size={'xs'} c={'dimmed'}>Квартир</Text>
							<Text fw={600} size={'lg'}>{building.units.length}</Text>
						</Stack>
						<Stack gap={4}>
							<Text size={'xs'} c={'dimmed'}>Площадь</Text>
							<Text fw={600} size={'lg'}>{building.totalArea} м²</Text>
						</Stack>
						<Stack gap={4}>
							<Text size={'xs'} c={'dimmed'}>Обновлено</Text>
							<Text fw={600} size={'lg'}>{formatDate(building.updatedAt)}</Text>
						</Stack>
					</SimpleGrid>
					<Group>
						<Button variant={'default'} leftSection={<IconFileUpload size={16} />} onClick={() => navigate(`/projects/${projectId}/buildings/${buildingId}/export`)}>
							Обновить из файла
						</Button>
						<Tooltip label={'Загрузите данные из файла'} disabled={building.units.length > 0}>
							<Button
								leftSection={showViewer ? <IconEyeOff size={16} /> : <IconEye size={16} />}
								disabled={building.units.length === 0}
								loading={isPending}
								onClick={() => startTransition(() => setShowViewer(v => !v))}
							>
								Посмотреть объект
							</Button>
						</Tooltip>
					</Group>
				</Group>

				<Divider my={'md'} />
			</Container>
			<Activity mode={showViewer ? 'visible' : 'hidden'}>
				<BuildingViewer units={building.units} />
			</Activity>
		</>
	)
}
