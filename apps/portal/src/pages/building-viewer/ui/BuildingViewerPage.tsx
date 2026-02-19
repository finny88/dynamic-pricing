import { useLocation, Navigate } from 'react-router-dom'
import { BuildingViewer } from '@widgets/BuildingViewer'
import type { Unit } from '@entities/unit'

interface LocationState {
	units: Unit[]
}

export const BuildingViewerPage = () => {
	const location = useLocation()
	const state = location.state as LocationState | null

	if (!state?.units) {
		return <Navigate to={'/'} replace />
	}

	return <BuildingViewer units={state.units} />
}
