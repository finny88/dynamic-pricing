import { Controller, useForm } from 'react-hook-form'
import { Button, Group, Modal, Select, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useCreateProjectMutation, type CreateProjectDto } from '@entities/project'

const initialProject: CreateProjectDto = {
	id: '',
	name: '',
	code: null,
	city: null,
	address: null,
	housingClass: null,
	profileStatus: '',
	buildingsCount: 0,
	lotsCount: 0,
	totalArea: 0,
	soldArea: 0,
	planArea: 0,
	factArea: 0,
}

const housingClassOptions = [
	{ value: 'economy', label: 'Эконом' },
	{ value: 'comfort', label: 'Комфорт' },
	{ value: 'business', label: 'Бизнес' },
	{ value: 'elite', label: 'Элит' },
]

interface Props {
	opened: boolean
	onClose: () => void
}

type FormValues = Pick<CreateProjectDto, 'name' | 'code' | 'housingClass' | 'city' | 'address'>

export const CreateProjectModal = ({ opened, onClose }: Props) => {
	const [createProject, { isLoading }] = useCreateProjectMutation()

	const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
		defaultValues: initialProject,
	})

	const handleClose = () => {
		reset()
		onClose()
	}

	const onSubmit = async (values: FormValues) => {
		const dto: CreateProjectDto = {
			...initialProject,
			id: crypto.randomUUID(),
			name: values.name.trim(),
			code: values.code?.trim() || null,
			housingClass: values.housingClass || null,
			city: values.city?.trim() || null,
			address: values.address?.trim() || null,
		}

		const result = await createProject(dto)
		if ('error' in result) { return }
		handleClose()
	}

	return (
		<Modal opened={opened} onClose={handleClose} size={'lg'} title={
			<Stack gap={2}>
				<Title order={4}>Новый ЖК</Title>
				<Text size={'sm'} c={'dimmed'}>Заполните базовую информацию</Text>
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
							Создать
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	)
}
