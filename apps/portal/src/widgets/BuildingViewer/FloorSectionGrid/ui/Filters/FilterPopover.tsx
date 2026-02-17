import { Button, Popover } from '@mantine/core'
import { useState, type FC, type ReactNode } from 'react'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'

interface FilterPopoverProps {
	label: string
	active?: boolean
	onOpen?: () => void
	children: (close: () => void) => ReactNode
}

export const FilterPopover: FC<FilterPopoverProps> = ({ label, active = false, onOpen, children }) => {
	const [opened, setOpened] = useState(false)

	const close = () => setOpened(false)

	const handleOpen = () => {
		if (onOpen) { onOpen() }
		setOpened(true)
	}

	return (
		<Popover opened={opened} onClose={close} withinPortal>
			<Popover.Target>
				<Button
					variant={active ? 'filled' : 'default'}
					radius={'xl'}
					size={'sm'}
					rightSection={opened ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
					onClick={() => opened ? close() : handleOpen()}
				>
					{label}
				</Button>
			</Popover.Target>
			<Popover.Dropdown>
				{children(close)}
			</Popover.Dropdown>
		</Popover>
	)
}