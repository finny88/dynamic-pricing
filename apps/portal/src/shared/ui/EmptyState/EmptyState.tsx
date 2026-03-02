import { Box, Button, Paper, Stack, Text } from '@mantine/core'
import type { ReactNode } from 'react'
import classes from './EmptyState.module.css'

interface EmptyStateProps {
	/** Icon to display in the empty state */
	icon?: ReactNode
	/** Custom content to display instead of icon (e.g., Group with multiple icons) */
	iconContent?: ReactNode
	/** Message text to show */
	message: string
	/** Button label */
	buttonLabel?: string
	/** Button click handler */
	onButtonClick?: () => void
	/** Optional left section icon for the button */
	buttonLeftSection?: ReactNode
	/** Minimum height of the empty state */
	mih?: number
}

export const EmptyState = ({ icon, iconContent, message, buttonLabel, onButtonClick, buttonLeftSection, mih = 240 }: EmptyStateProps) => (
	<Paper
		withBorder
		className={classes.paper}
		p={'xl'}
		mih={mih}
	>
		<Stack align={'center'} gap={'md'}>
			{iconContent ? (
				iconContent
			) : icon && (
				<Box c={'gray'} h={64} w={64}>
					{icon}
				</Box>
			)}
			<Text size={'lg'} c={'dimmed'}>{message}</Text>
			{buttonLabel && onButtonClick && (
				<Button variant={'outline'} leftSection={buttonLeftSection} onClick={onButtonClick}>
					{buttonLabel}
				</Button>
			)}
		</Stack>
	</Paper>
)
