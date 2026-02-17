import { Button, Popover, Stack } from '@mantine/core'
import { useContext, type FC, type ReactNode } from 'react'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { FilterGroupContext } from './FilterGroupContext'

interface FilterPopoverProps {
	id: string
	label: string
	active?: boolean
	onOpen?: () => void
	children: (close: () => void) => ReactNode
}

export const FilterPopover: FC<FilterPopoverProps> = ({ id, label, active = false, onOpen, children }) => {
	const { openedId, setOpenedId } = useContext(FilterGroupContext)
	const opened = openedId === id

	const close = () => setOpenedId(null)

	const handleOpen = () => {
		if (onOpen) { onOpen() }
		setOpenedId(id)
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
				<Stack gap={'sm'}>
					{children(close)}
				</Stack>
			</Popover.Dropdown>
		</Popover>
	)
}
