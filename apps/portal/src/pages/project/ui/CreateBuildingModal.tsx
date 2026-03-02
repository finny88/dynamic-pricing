import { useImperativeHandle, type Ref } from 'react'
import { useForm } from 'react-hook-form'
import { Modal, Stack, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useCreateBuildingMutation, type CreateBuildingDto } from '@entities/building'
import { isObjectOfTypeWithProperty } from '@shared/lib/typeGuards'
import { BuildingFormFields } from './BuildingFormFields'
import type { BuildingFormValues } from './buildingFormConfig'

export interface CreateBuildingModalHandle {
	open: () => void
}

export const CreateBuildingModal = ({ ref, projectId }: { ref: Ref<CreateBuildingModalHandle>; projectId: string }) => {
	const [createBuilding, { isLoading }] = useCreateBuildingMutation()
	const [opened, { open, close }] = useDisclosure(false)

	const { register, handleSubmit, reset, formState: { errors } } = useForm<BuildingFormValues>({
		defaultValues: { name: '', address: '' },
	})

	useImperativeHandle(ref, () => ({ open }))

	const onSubmit = async (values: BuildingFormValues) => {
		const dto: CreateBuildingDto = {
			id: crypto.randomUUID(),
			projectId,
			name: values.name.trim(),
			address: values.address?.trim() || null,
			totalArea: 0,
			units: [],
		}

		const result = await createBuilding(dto)
		if (isObjectOfTypeWithProperty(result, 'error')) { return }
		close()
	}

	return (
		<Modal
			opened={opened}
			onClose={close}
			onExitTransitionEnd={() => reset()}
			title={
				<Stack gap={2}>
					<Title order={4}>Новый корпус</Title>
					<Text size={'sm'} c={'dimmed'}>Заполните базовую информацию</Text>
				</Stack>
			}
		>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<BuildingFormFields
					register={register}
					errors={errors}
					isLoading={isLoading}
					submitLabel={'Создать'}
					onCancel={close}
				/>
			</form>
		</Modal>
	)
}
