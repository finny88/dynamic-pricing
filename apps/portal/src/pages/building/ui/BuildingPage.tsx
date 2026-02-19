import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingOverlay } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { ExcelUpload } from '@features/excel-upload'
import { useUnits } from '@entities/unit'
import type { Unit } from '@entities/unit'

const NAVIGATE_DELAY = 800

export const BuildingPage = () => {
	const navigate = useNavigate()
	const { setUnits } = useUnits()
	const [navigating, setNavigating] = useState(false)

	const handleSuccess = (units: Unit[]) => {
		setUnits(units)
		notifications.show({
			title: 'Файл обработан',
			message: `Загружено ${units.length} помещений`,
			color: 'green',
		})
		setNavigating(true)
		setTimeout(() => {
			navigate('/viewer')
		}, NAVIGATE_DELAY)
	}

	return (
		<>
			<LoadingOverlay
				visible={navigating}
				loaderProps={{ type: 'dots' }}
			/>
			<ExcelUpload onSuccess={handleSuccess} />
		</>
	)
}
