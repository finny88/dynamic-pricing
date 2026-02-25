import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, Group, Modal, Select, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useUpdateProjectMutation, type CreateProjectDto, type Project } from '@entities/project'

const housingClassOptions = [
	{ value: 'economy', label: 'Эконом' },
	{ value: 'comfort', label: 'Комфорт' },
	{ value: 'business', label: 'Бизнес' },
	{ value: 'elite', label: 'Элит' },
]

interface Props {
	opened: boolean
	onClose: () => void
	project: Project
}

type FormValues = Pick<CreateProjectDto, 'name' | 'code' | 'housingClass' | 'city' | 'address'>

export const EditProjectModal = ({ opened, onClose, project }: Props) => {
	const [updateProject, { isLoading }] = useUpdateProjectMutation()

	const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
		defaultValues: {
			name: project.name,
			code: project.code,
			city: project.city,
			address: project.address,
			housingClass: project.housingClass,
		},
	})

	useEffect(() => {
		reset({
			name: project.name,
			code: project.code,
			city: project.city,
			address: project.address,
			housingClass: project.housingClass,
		})
	}, [project, reset])

	const handleClose = () => {
		reset()
		onClose()
	}

	const onSubmit = async (values: FormValues) => {
		const dto: CreateProjectDto = {
			...project,
			name: values.name.trim(),
			code: values.code?.trim() || null,
			housingClass: values.housingClass || null,
			city: values.city?.trim() || null,
			address: values.address?.trim() || null,
		}

		const result = await updateProject(dto)
		if ('error' in result) { return }
		handleClose()
	}

	return (
		<Modal opened={opened} onClose={handleClose} size={'lg'} title={
			<Stack gap={2}>
				<Title order={4}>Редактировать ЖК</Title>
				<Text size={'sm'} c={'dimmed'}>{project.name}</Text>
			</Stack>
		}>
			<form onSubmit={handleSubmit(onSubmit)}>
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
							label={'Код проекта'}
							placeholder={'Введите код'}
							{...register('code')}
						/>
						<TextInput
							label={'Город'}
							placeholder={'Введите город'}
							{...register('city')}
						/>
					</SimpleGrid>
					<TextInput
						label={'Адрес'}
						placeholder={'Введите адрес'}
						{...register('address')}
					/>
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
						<Button variant={'default'} onClick={handleClose}>
							Отмена
						</Button>
						<Button type={'submit'} loading={isLoading}>
							Сохранить
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	)
}
