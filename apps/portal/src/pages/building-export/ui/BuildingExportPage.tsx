import { useParams, useNavigate } from 'react-router-dom'
import { Button, Container, Divider, Skeleton, Stack, Title } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { useGetBuildingByIdQuery, useUpdateBuildingMutation, BuildingPageHeader, type BuildingPageInitialState } from '@entities/building'
import { useGetProjectQuery } from '@entities/project'
import type { Unit } from '@entities/unit'
import { ExcelUpload } from '@features/excel-upload'

export const BuildingExportPage = () => {
	const { projectId, buildingId } = useParams<{ projectId: string; buildingId: string }>()
	const navigate = useNavigate()

	const { data: building = null, isLoading, error } = useGetBuildingByIdQuery({ projectId: projectId!, buildingId: buildingId! },
		{ skip: !projectId || !buildingId },)
	const [updateBuilding] = useUpdateBuildingMutation()
	const { data: project } = useGetProjectQuery(projectId!, { skip: !projectId })

	if (isLoading) {
		return (
			<Container size={'xl'} pt={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
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
			<Container size={'xl'} pt={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
				<Stack align={'center'} pt={'xl'} gap={8}>
					<Title order={3} c={'dimmed'}>Корпус не найден</Title>
					<Button variant={'subtle'} leftSection={<IconArrowLeft size={16} />} onClick={() => navigate(`/projects/${projectId}`)}>
						Вернуться к проекту
					</Button>
				</Stack>
			</Container>
		)
	}

	const handleSuccess = async (units: Unit[], mappedHeaders: string[]) => {
		const { updatedAt: _, ...buildingDto } = building
		await updateBuilding({ ...buildingDto, units })
		navigate(`/projects/${projectId}/buildings/${buildingId}`, { state: { showViewer: true, mappedHeaders } satisfies BuildingPageInitialState })
	}

	return (
		<>
			<Container size={'xl'} pt={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
				<BuildingPageHeader
					building={building}
					projectId={projectId!}
					projectName={project?.name ?? ''}
					buildingLink={`/projects/${projectId}/buildings/${buildingId}`}
				/>
			</Container>
			<ExcelUpload onSuccess={(units, mappedHeaders) => { void handleSuccess(units, mappedHeaders) }} />
		</>
	)
}
