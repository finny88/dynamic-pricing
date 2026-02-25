import { useState } from 'react'
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

export const CreateProjectModal = ({ opened, onClose }: Props) => {
	const [createProject, { isLoading }] = useCreateProjectMutation()

	const [name, setName] = useState('')
	const [code, setCode] = useState('')
	const [housingClass, setHousingClass] = useState<string | null>(null)
	const [city, setCity] = useState('')
	const [address, setAddress] = useState('')
	const [nameError, setNameError] = useState('')

	const handleClose = () => {
		setName('')
		setCode('')
		setHousingClass(null)
		setCity('')
		setAddress('')
		setNameError('')
		onClose()
	}

	const handleSubmit = async () => {
		if (!name.trim()) {
			setNameError('Название обязательно для заполнения')
			return
		}

		const dto: CreateProjectDto = {
			...initialProject,
			id: crypto.randomUUID(),
			name: name.trim(),
			code: code.trim() || null,
			housingClass: housingClass || null,
			city: city.trim() || null,
			address: address.trim() || null,
		}

		await createProject(dto)
		handleClose()
	}

	return (
		<Modal opened={opened} onClose={handleClose} size={'lg'} title={
			<Stack gap={2}>
				<Title order={4}>Новый ЖК</Title>
				<Text size={'sm'} c={'dimmed'}>Заполните базовую информацию</Text>
			</Stack>
		}>
			<Stack gap={'md'}>
				<TextInput
					label={'Название ЖК'}
					placeholder={'Введите название'}
					required
					value={name}
					onChange={(e) => {
						setName(e.currentTarget.value)
						if (nameError) { setNameError('') }
					}}
					error={nameError}
				/>
				<SimpleGrid cols={2}>
					<TextInput
						label={'Код проекта'}
						placeholder={'Введите код'}
						value={code}
						onChange={(e) => setCode(e.currentTarget.value)}
					/>
					<TextInput
						label={'Город'}
						placeholder={'Введите город'}
						value={city}
						onChange={(e) => setCity(e.currentTarget.value)}
					/>
				</SimpleGrid>
				<TextInput
					label={'Адрес'}
					placeholder={'Введите адрес'}
					value={address}
					onChange={(e) => setAddress(e.currentTarget.value)}
				/>
				<Select
					label={'Класс жилья'}
					placeholder={'Выберите класс'}
					data={housingClassOptions}
					value={housingClass}
					onChange={setHousingClass}
					clearable
					w={'50%'}
					rightSection={<IconChevronDown size={16} />}
				/>
				<Group justify={'flex-end'} mt={'sm'}>
					<Button variant={'default'} onClick={handleClose}>
						Отмена
					</Button>
					<Button onClick={handleSubmit} loading={isLoading}>
						Создать
					</Button>
				</Group>
			</Stack>
		</Modal>
	)
}
