import { useForm } from 'react-hook-form'
import { Modal, Stack, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useUpdateProjectMutation, type CreateProjectDto, type Project } from '@entities/project'
import { ProjectFormFields } from './ProjectFormFields'
import type { ProjectFormValues } from './projectFormConfig'

interface Props {
	project: Project
	onClose: () => void
}

export const EditProjectModal = ({ project, onClose }: Props) => {
	const [updateProject, { isLoading }] = useUpdateProjectMutation()
	const [opened, { close }] = useDisclosure(true)

	const { register, handleSubmit, control, formState: { errors } } = useForm<ProjectFormValues>({
		defaultValues: {
			name: project.name,
			code: project.code,
			region: project.region,
			area: project.area,
			city: project.city,
			housingClass: project.housingClass,
		},
	})

	const onSubmit = async (values: ProjectFormValues) => {
		const dto: CreateProjectDto = {
			...project,
			name: values.name.trim(),
			code: values.code?.trim() || null,
			housingClass: values.housingClass || null,
			region: values.region?.trim() || null,
			area: values.area?.trim() || null,
			city: values.city?.trim() || null,
		}

		const result = await updateProject(dto)
		if ('error' in result) { return }
		close()
	}

	return (
		<Modal
			opened={opened}
			onClose={close}
			onExitTransitionEnd={onClose}
			size={'lg'}
			title={
				<Stack gap={2}>
					<Title order={4}>Редактировать ЖК</Title>
					<Text size={'sm'} c={'dimmed'}>{project.name}</Text>
				</Stack>
			}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ProjectFormFields
					register={register}
					control={control}
					errors={errors}
					isLoading={isLoading}
					submitLabel={'Сохранить'}
					onCancel={close}
				/>
			</form>
		</Modal>
	)
}
