import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { BuildingViewer } from '@widgets/BuildingViewer'
import { useGetBuildingByIdQuery } from '@entities/building'
import { Container, Skeleton, Stack } from '@mantine/core'
import { BuildingTitle } from './BuildingTitle'

export const BuildingViewerPage = () => {
	const { projectId, buildingId } = useParams<{ projectId: string; buildingId: string }>()
	const navigate = useNavigate()

	const { data: building = null, isLoading } = useGetBuildingByIdQuery({ projectId: projectId!, buildingId: buildingId! }, { skip: !projectId || !buildingId })

	if (isLoading) {
		return (
			<Container size={'xxl'} pt={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
				<Stack gap={'lg'}>
					<Skeleton h={40} w={300} />
					<Skeleton h={600} />
				</Stack>
			</Container>
		)
	}

	if (!building || building.units.length === 0) {
		return <Navigate to={`/projects/${projectId}/buildings/${buildingId}`} replace />
	}

	return (
		<Container size={'xxl'} pt={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
			<BuildingTitle
				units={building.units}
				onBack={() => navigate(`/projects/${projectId}/buildings/${buildingId}`)}
			/>
			<BuildingViewer units={building.units} />
		</Container>
	)
}
