import { Navigate } from 'react-router-dom'
import { BuildingViewer } from '@widgets/BuildingViewer'
import { useUnits } from '@entities/unit'

export const BuildingViewerPage = () => {
	const { units } = useUnits()

	if (!units) {
		return <Navigate to={'/'} replace />
	}

	return <BuildingViewer units={units} />
}
