import { useImperativeHandle, type Ref } from 'react'
import { useForm } from 'react-hook-form'
import { Modal, Stack, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useCreateProjectMutation, type CreateProjectDto } from '@entities/project'
import { ProjectFormFields } from './ProjectFormFields'
import type { ProjectFormValues } from './projectFormConfig'

const initialProject: CreateProjectDto = {
	id: '',
	name: '',
	developer: null,
	region: null,
	area: null,
	city: null,
	housingClass: null,
	profileStatus: '',
	buildingsCount: 0,
	lotsCount: 0,
	totalArea: 0,
	soldArea: 0,
	planArea: 0,
	factArea: 0,
}

export interface CreateProjectModalHandle {
	open: () => void
}

export const CreateProjectModal = ({ ref }: { ref: Ref<CreateProjectModalHandle> }) => {
	const [createProject, { isLoading }] = useCreateProjectMutation()
	const [opened, { open, close }] = useDisclosure(false)

	const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ProjectFormValues>({
		defaultValues: initialProject,
	})

	useImperativeHandle(ref, () => ({ open }))

	const onSubmit = async (values: ProjectFormValues) => {
		const dto: CreateProjectDto = {
			...initialProject,
			id: crypto.randomUUID(),
			name: values.name.trim(),
			developer: values.developer?.trim() || null,
			housingClass: values.housingClass || null,
			region: values.region?.trim() || null,
			area: values.area?.trim() || null,
			city: values.city?.trim() || null,
		}

		const result = await createProject(dto)
		if ('error' in result) { return }
		close()
	}

	return (
		<Modal
			opened={opened}
			onClose={close}
			onExitTransitionEnd={() => reset()}
			size={'lg'}
			title={
				<Stack gap={2}>
					<Title order={4}>Новый ЖК</Title>
					<Text size={'sm'} c={'dimmed'}>Заполните базовую информацию</Text>
				</Stack>
			}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<ProjectFormFields
					register={register}
					control={control}
					errors={errors}
					isLoading={isLoading}
					submitLabel={'Создать'}
					onCancel={close}
				/>
			</form>
		</Modal>
	)
}
