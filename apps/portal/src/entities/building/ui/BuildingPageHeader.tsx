import { useNavigate } from 'react-router-dom'
import { ActionIcon, Divider, Group, Stack, Title } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { LocationText } from '@shared/ui/LocationText'
import type { Building } from '../model/building'

interface Props {
	building: Building
	projectId: string
}

export const BuildingPageHeader = ({ building, projectId }: Props) => {
	const navigate = useNavigate()

	return (
		<>
			<Group mb={'xl'} gap={'sm'}>
				<ActionIcon variant={'subtle'} color={'gray'} onClick={() => navigate(`/projects/${projectId}`)}>
					<IconArrowLeft size={18} />
				</ActionIcon>
				<Stack gap={2}>
					<Title order={2}>{building.name}</Title>
					<LocationText locationParts={[building.address]} />
				</Stack>
			</Group>
			<Divider mb={'xl'} />
		</>
	)
}
