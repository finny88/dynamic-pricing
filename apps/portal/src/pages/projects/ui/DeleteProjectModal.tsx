import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useDeleteProjectMutation, type Project } from '@entities/project'
import { isObjectOfTypeWithProperty } from '@shared/lib/typeGuards'

interface Props {
	project: Project
	onClose: () => void
}

export const DeleteProjectModal = ({ project, onClose }: Props) => {
	const [deleteProject, { isLoading }] = useDeleteProjectMutation()
	const [opened, { close }] = useDisclosure(true)

	const handleConfirm = async () => {
		const result = await deleteProject(project.id)
		if (isObjectOfTypeWithProperty(result, 'error')) { return }
		close()
	}

	return (
		<Modal
			opened={opened}
			onClose={close}
			onExitTransitionEnd={onClose}
			title={'Удалить проект'}
			size={'sm'}
		>
			<Stack>
				<Text size={'sm'}>
					Вы уверены, что хотите удалить <strong>{project.name}</strong>? Это действие необратимо.
				</Text>
				<Group justify={'flex-end'} mt={'xs'}>
					<Button variant={'default'} onClick={close}>Отмена</Button>
					<Button color={'red'} loading={isLoading} onClick={handleConfirm}>Удалить</Button>
				</Group>
			</Stack>
		</Modal>
	)
}
