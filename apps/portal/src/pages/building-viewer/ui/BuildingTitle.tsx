import { useMemo } from 'react'
import { ActionIcon, Group, Title, Tooltip } from '@mantine/core'
import { IconArrowBack } from '@tabler/icons-react'
import type { Unit } from '@entities/unit'

interface BuildingTitleProps {
	units: Unit[]
	onBack: () => void
}

export const BuildingTitle = ({ units, onBack }: BuildingTitleProps) => {
	const firstAddress = useMemo(() => {
		if (!units || units.length === 0) { return 'Адрес не указан' }
		return units.find(unit => unit.address)?.address || 'Адрес не указан'
	}, [units])

	return (
		<Group mb={'lg'} pos={'relative'} justify={'center'}>
			<Tooltip label={'Вернуться к корпусу'}>
				<ActionIcon
					variant={'subtle'}
					radius={'xl'}
					style={{ border: '1px solid black' }}
					onClick={onBack}
				>
					<IconArrowBack color={'black'} style={{ transform: 'scaleY(-1)' }} />
				</ActionIcon>
			</Tooltip>
			<Title order={2} mx={'auto'}>
				{firstAddress}
			</Title>
		</Group>
	)
}
