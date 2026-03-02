import { Text } from '@mantine/core'
import { IconMapPin } from '@tabler/icons-react'
import classes from './LocationText.module.css'

interface Props {
	locationParts: (string | null | undefined)[]
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	lineClamp?: number
}

export const LocationText = ({ locationParts, size = 'sm', lineClamp }: Props) => {
	const location = locationParts.filter(Boolean).join(', ')

	if (!location) { return null }

	return (
		<div className={classes.root}>
			<span className={classes.icon}>
				<IconMapPin size={14} color={'gray'} />
			</span>
			<Text size={size} c={'dimmed'} className={classes.text} lineClamp={lineClamp}>
				{location}
			</Text>
		</div>
	)
}
