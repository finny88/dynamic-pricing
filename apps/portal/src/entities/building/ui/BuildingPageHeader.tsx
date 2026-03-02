import { Anchor, Breadcrumbs, Divider, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'
import { LocationText } from '@shared/ui/LocationText'
import type { Building } from '../model/building'

interface Props {
	building: Building
	projectId: string
	projectName: string
	buildingLink?: string
}

export const BuildingPageHeader = ({ building, projectId, projectName, buildingLink }: Props) => {
	const buildingItem = buildingLink
		? <Anchor component={Link} to={buildingLink} size={'sm'}>{building.name}</Anchor>
		: <Text size={'sm'}>{building.name}</Text>

	return (
		<>
			<Breadcrumbs mb={'sm'}>
				<Anchor component={Link} to={'/projects'} size={'sm'}>Все ЖК</Anchor>
				<Anchor component={Link} to={`/projects/${projectId}`} size={'sm'}>{projectName}</Anchor>
				{buildingItem}
			</Breadcrumbs>
			<Stack gap={2} mb={'md'}>
				<Title order={2}>{building.name}</Title>
				<LocationText locationParts={[building.address]} />
			</Stack>
			<Divider mb={'md'} />
		</>
	)
}
