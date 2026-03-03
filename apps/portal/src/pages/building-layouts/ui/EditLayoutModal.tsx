import { Button, Group, Image, Modal, Stack, Text, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useRef, useState } from 'react'
import type { UnitLayout } from '@entities/unit-layout'
import { useUpdateLayoutMutation } from '@entities/unit-layout'
import classes from './EditLayoutModal.module.css'

interface Props {
	layout: UnitLayout
	projectId: string
	buildingId: string
	onClose: () => void
}

export const EditLayoutModal = ({ layout, projectId, buildingId, onClose }: Props) => {
	const [updateLayout, { isLoading }] = useUpdateLayoutMutation()
	const [opened, { close }] = useDisclosure(true)
	const [name, setName] = useState(layout.name)
	const [imageDataUrl, setImageDataUrl] = useState<string | null>(layout.image)
	const fileRef = useRef<HTMLInputElement>(null)

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
		await updateLayout({
			projectId,
			buildingId,
			layoutId: layout.id,
			dto: { id: layout.id, name: name.trim(), image: imageDataUrl, unitNumbers: layout.unitNumbers },
		})
		close()
	}

	return (
		<Modal
			opened={opened}
			onClose={close}
			onExitTransitionEnd={onClose}
			title={'Редактировать планировку'}
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
						Сохранить
					</Button>
				</Group>
			</Stack>
		</Modal>
	)
}
