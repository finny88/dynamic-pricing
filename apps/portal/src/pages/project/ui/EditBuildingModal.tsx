import { Modal, Stack, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from 'react-hook-form'
import { useUpdateBuildingMutation, type Building, type CreateBuildingDto } from '@entities/building'
import { isObjectOfTypeWithProperty } from '@shared/lib/typeGuards'
import type { BuildingFormValues } from './buildingFormConfig'
import { BuildingFormFields } from './BuildingFormFields'

interface Props {
	building: Building
	onClose: () => void
}

export const EditBuildingModal = ({ building, onClose }: Props) => {
	const [updateBuilding, { isLoading }] = useUpdateBuildingMutation()
	const [opened, { close }] = useDisclosure(true)

	const { register, handleSubmit, formState: { errors } } = useForm<BuildingFormValues>({
		defaultValues: {
			name: building.name,
			address: building.address ?? '',
		},
	})

	const onSubmit = async (values: BuildingFormValues) => {
		const dto: CreateBuildingDto = {
			...building,
			name: values.name.trim(),
			address: values.address?.trim() || null,
		}

		const result = await updateBuilding(dto)
		if (isObjectOfTypeWithProperty(result, 'error')) { return }
		close()
	}

	return (
		<Modal
			opened={opened}
			onClose={close}
			onExitTransitionEnd={onClose}
			title={
				<Stack gap={2}>
					<Title order={4}>Редактировать дом</Title>
					<Text size={'sm'} c={'dimmed'}>{building.name}</Text>
				</Stack>
			}
		>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<BuildingFormFields
					register={register}
					errors={errors}
					isLoading={isLoading}
					submitLabel={'Сохранить'}
					onCancel={close}
				/>
			</form>
		</Modal>
	)
}
