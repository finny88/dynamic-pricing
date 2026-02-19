import { useNavigate } from 'react-router-dom'
import { ExcelUpload } from '@features/excel-upload'
import type { Unit } from '@entities/unit'

export const BuildingPage = () => {
	const navigate = useNavigate()
	const handleSuccess = (units: Unit[]) => void navigate('/viewer', { state: { units } })
	return <ExcelUpload onSuccess={handleSuccess} />
}
