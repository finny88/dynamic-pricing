import { useNavigate } from 'react-router-dom'
import { ExcelUpload } from '@features/excel-upload'
import { useUnits } from '@entities/unit'
import type { Unit } from '@entities/unit'

export const BuildingPage = () => {
	const navigate = useNavigate()
	const { setUnits } = useUnits()
	const handleSuccess = (units: Unit[]) => {
		setUnits(units)
		navigate('/viewer')
	}
	return <ExcelUpload onSuccess={handleSuccess} />
}
