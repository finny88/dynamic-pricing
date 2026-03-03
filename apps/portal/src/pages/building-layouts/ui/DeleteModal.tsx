import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import type { UnitLayout } from '@entities/unit-layout'
import { useDeleteLayoutMutation } from '@entities/unit-layout'

interface Props {
	layout: UnitLayout
	projectId: string
	buildingId: string
	onClose: () => void
}

export const DeleteModal = ({ layout, projectId, buildingId, onClose }: Props) => {
	const [deleteLayout, { isLoading }] = useDeleteLayoutMutation()
	const [opened, { close }] = useDisclosure(true)

	const handleConfirm = async () => {
		await deleteLayout({ projectId, buildingId, layoutId: layout.id })
		close()
	}

	return (
		<Modal opened={opened} onClose={close} onExitTransitionEnd={onClose} title={'Удалить планировку'} size={'sm'}>
			<Stack gap={'md'}>
				<Text size={'sm'}>
					Вы уверены, что хотите удалить планировку{' '}
					<Text component={'span'} fw={600}>«{layout.name}»</Text>?
					Это действие нельзя отменить.
				</Text>
				<Group justify={'flex-end'}>
					<Button variant={'default'} onClick={close}>Отмена</Button>
					<Button color={'red'} loading={isLoading} onClick={handleConfirm}>Удалить</Button>
				</Group>
			</Stack>
		</Modal>
	)
}
