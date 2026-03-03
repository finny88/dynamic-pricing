import { Box, Text, Group, Tooltip } from '@mantine/core'
import type { FC } from 'react'
import { DEFAULT_COLOR_SCHEMES } from '../../lib/colors'
import { UNIT_STATUS_LABELS, UNIT_STATUS_TOOLTIPS } from '../../model/unitStatus'
import type { UnitStatus } from '../../model/unitStatus'
import classes from './StatusLegend.module.css'

export const StatusLegend: FC = () => {
	return (
		<Group gap={'md'} justify={'flex-start'}>
			{(Object.keys(UNIT_STATUS_LABELS) as UnitStatus[]).map(status => (
				<Group key={status} gap={'xs'}>
					<Tooltip label={UNIT_STATUS_TOOLTIPS[status]} position={'bottom'} multiline maw={240} withArrow>
						<Box className={classes.legendBox} style={{ backgroundColor: DEFAULT_COLOR_SCHEMES[status].background }}>
							<Text size={'xs'} fw={700} style={{ color: 'white', lineHeight: 1 }}>i</Text>
						</Box>
					</Tooltip>
					<Text size={'sm'}>{UNIT_STATUS_LABELS[status]}</Text>
				</Group>
			))}
		</Group>
	)
}
