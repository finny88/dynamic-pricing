import { type Control, Controller, type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { Button, Group, Select, SimpleGrid, Stack, TextInput } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { housingClassOptions, type ProjectFormValues } from './projectFormConfig'

interface Props {
	register: UseFormRegister<ProjectFormValues>
	control: Control<ProjectFormValues>
	errors: FieldErrors<ProjectFormValues>
	isLoading: boolean
	submitLabel: string
	onCancel: () => void
}

export const ProjectFormFields = ({ register, control, errors, isLoading, submitLabel, onCancel }: Props) => (
	<Stack gap={'md'}>
		<TextInput
			label={'Название ЖК'}
			placeholder={'Введите название'}
			required
			error={errors.name?.message}
			{...register('name', { required: 'Название обязательно для заполнения' })}
		/>
		<SimpleGrid cols={2}>
			<TextInput
				label={'Застройщик'}
				placeholder={'Введите застройщика'}
				{...register('developer')}
			/>
			<TextInput
				label={'Регион'}
				placeholder={'Введите регион'}
				{...register('region')}
			/>
		</SimpleGrid>
		<SimpleGrid cols={2}>
			<TextInput
				label={'Район'}
				placeholder={'Введите район'}
				{...register('area')}
			/>
			<TextInput
				label={'Город'}
				placeholder={'Введите город'}
				{...register('city')}
			/>
		</SimpleGrid>
		<Controller
			name={'housingClass'}
			control={control}
			render={({ field }) => (
				<Select
					label={'Класс жилья'}
					placeholder={'Выберите класс'}
					data={housingClassOptions}
					value={field.value}
					onChange={field.onChange}
					clearable
					w={'50%'}
					rightSection={<IconChevronDown size={16} />}
				/>
			)}
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
