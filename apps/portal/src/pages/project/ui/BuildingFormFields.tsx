import { Button, Group, Stack, TextInput } from '@mantine/core'
import { type FieldErrors, type UseFormRegister } from 'react-hook-form'
import type { BuildingFormValues } from './buildingFormConfig'

interface Props {
	register: UseFormRegister<BuildingFormValues>
	errors: FieldErrors<BuildingFormValues>
	isLoading: boolean
	submitLabel: string
	onCancel: () => void
}

export const BuildingFormFields = ({ register, errors, isLoading, submitLabel, onCancel }: Props) => (
	<Stack gap={'md'}>
		<TextInput
			label={'Название корпуса'}
			placeholder={'Введите название'}
			required
			error={errors.name?.message}
			{...register('name', { required: 'Название обязательно для заполнения' })}
		/>
		<TextInput
			label={'Адрес'}
			placeholder={'Введите адрес'}
			{...register('address')}
		/>
		<Group justify={'flex-end'} mt={'sm'}>
			<Button variant={'default'} onClick={onCancel}>
				Отмена
			</Button>
			<Button type={'submit'} loading={isLoading}>
				{submitLabel}
			</Button>
		</Group>
	</Stack>
)
