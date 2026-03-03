import { Button, Group, Image, Modal, Stack, Text, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useImperativeHandle, useRef, useState, type Ref } from 'react'
import { useCreateLayoutMutation } from '@entities/unit-layout'
import classes from './LayoutModal.module.css'

export interface CreateLayoutModalHandle {
	open: () => void
}

interface Props {
	ref: Ref<CreateLayoutModalHandle>
	projectId: string
	buildingId: string
}

export const CreateLayoutModal = ({ ref, projectId, buildingId }: Props) => {
	const [createLayout, { isLoading }] = useCreateLayoutMutation()
	const [opened, { open, close }] = useDisclosure(false)
	const [name, setName] = useState('')
	const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
	const fileRef = useRef<HTMLInputElement>(null)

	useImperativeHandle(ref, () => ({ open }))

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) { return }
		const reader = new FileReader()
		reader.onload = () => setImageDataUrl(reader.result as string)
		reader.readAsDataURL(file)
	}

	const canSubmit = name.trim().length > 0 && imageDataUrl !== null

	const handleSubmit = async () => {
		if (!canSubmit || imageDataUrl === null) { return }
		await createLayout({
			projectId,
			buildingId,
			dto: { id: crypto.randomUUID(), name: name.trim(), image: imageDataUrl, unitNumbers: [] },
		})
		close()
	}

	const handleReset = () => {
		setName('')
		setImageDataUrl(null)
		if (fileRef.current) { fileRef.current.value = '' }
	}

	return (
		<Modal
			opened={opened}
			onClose={close}
			onExitTransitionEnd={handleReset}
			title={'Добавить планировку'}
		>
			<Stack gap={'md'}>
				<TextInput
					label={'Наименование'}
					placeholder={'Введите название планировки'}
					required
					value={name}
					onChange={e => setName(e.currentTarget.value)}
				/>

				<Stack gap={4}>
					<Text size={'sm'} fw={500}>
						Изображение <Text component={'span'} c={'red'}>*</Text>
					</Text>
					{imageDataUrl && (
						<Image
							src={imageDataUrl}
							alt={'Предпросмотр планировки'}
							mah={200}
							fit={'contain'}
							radius={'sm'}
						/>
					)}
					<Button
						variant={'default'}
						size={'sm'}
						onClick={() => fileRef.current?.click()}
					>
						{imageDataUrl ? 'Заменить изображение' : 'Выбрать изображение'}
					</Button>
					<input
						ref={fileRef}
						type={'file'}
						accept={'image/*'}
						className={classes.hiddenInput}
						onChange={handleFileChange}
					/>
				</Stack>

				<Group justify={'flex-end'} mt={'xs'}>
					<Button variant={'default'} onClick={close}>Отмена</Button>
					<Button disabled={!canSubmit} loading={isLoading} onClick={handleSubmit}>
						Добавить
					</Button>
				</Group>
			</Stack>
		</Modal>
	)
}
