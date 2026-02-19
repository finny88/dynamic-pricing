import { Navigate } from 'react-router-dom'
import { BuildingViewer } from '@widgets/BuildingViewer'
import { useUnits } from '@entities/unit'
import { Container } from '@mantine/core'
import { BuildingTitle } from './BuildingTitle'

export const BuildingViewerPage = () => {
	const { units } = useUnits()

	if (!units) {
		return <Navigate to={'/'} replace />
	}

	return (
		<Container size={'xxl'} pt={{ base: 'md', sm: 'lg', md: 'xl' }}>
			<BuildingTitle units={units} />
			<BuildingViewer units={units} />
		</Container>
	)
}
