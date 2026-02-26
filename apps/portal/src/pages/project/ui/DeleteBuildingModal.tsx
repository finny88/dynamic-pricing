import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useDeleteBuildingMutation, type Building } from '@entities/building'

interface Props {
	building: Building
	onClose: () => void
}

export const DeleteBuildingModal = ({ building, onClose }: Props) => {
	const [deleteBuilding, { isLoading }] = useDeleteBuildingMutation()
	const [opened, { close }] = useDisclosure(true)

	const handleConfirm = async () => {
		const result = await deleteBuilding({ id: building.id, projectId: building.projectId })
		if ('error' in result) { return }
		close()
	}

	return (
		<Modal
			opened={opened}
			onClose={close}
			onExitTransitionEnd={onClose}
			title={'Удалить корпус'}
			size={'sm'}
		>
			<Stack>
				<Text size={'sm'}>
					Вы уверены, что хотите удалить <strong>{building.name}</strong>? Это действие необратимо.
				</Text>
				<Group justify={'flex-end'} mt={'xs'}>
					<Button variant={'default'} onClick={close}>Отмена</Button>
					<Button color={'red'} loading={isLoading} onClick={handleConfirm}>Удалить</Button>
				</Group>
			</Stack>
		</Modal>
	)
}
