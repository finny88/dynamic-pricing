import { useMemo } from 'react'
import { Title } from '@mantine/core'
import type { Unit } from '@entities/unit'

interface BuildingTitleProps {
	units: Unit[]
}

export const BuildingTitle = ({ units }: BuildingTitleProps) => {
	const firstAddress = useMemo(() => {
		if (!units || units.length === 0) { return 'Адрес не указан' }
		return units.find(unit => unit.address)?.address || 'Адрес не указан'
	}, [units])

	return (
		<Title order={2} mb={'md'} ta={'center'}>
			{firstAddress}
		</Title>
	)
}