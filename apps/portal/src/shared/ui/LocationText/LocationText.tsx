import { Text } from '@mantine/core'
import { IconMapPin } from '@tabler/icons-react'

interface Props {
	locationParts: (string | null | undefined)[]
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	lineClamp?: number
}

export const LocationText = ({ locationParts, size = 'sm', lineClamp }: Props) => {
	const location = locationParts.filter(Boolean).join(', ')

	if (!location) { return null }

	return (
		<div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
			<span style={{ flexShrink: 0 }}>
				<IconMapPin size={14} color={'gray'} />
			</span>
			<Text size={size} c={'dimmed'} style={{ flex: 1 }} lineClamp={lineClamp}>
				{location}
			</Text>
		</div>
	)
}
