
import { useRef, useState } from 'react'
import { Button, Container, Group, TextInput, Title } from '@mantine/core'
import { IconFile, IconFolder, IconTrash } from '@tabler/icons-react'

const ACCEPT = '.xls,.xlsx,.csv,.xml'

export const BuildingPage = () => {
	const [file, setFile] = useState<File | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	return (
		<Container pt={'sm'}>
			<input
				ref={inputRef}
				type={'file'}
				accept={ACCEPT}
				style={{ display: 'none' }}
				onChange={(e) => {
					setFile(e.target.files?.[0] ?? null)
					e.target.value = ''
				}}
			/>
			<TextInput
				label={<Title order={3}>Загрузить файл</Title>}
				styles={{ label: { display: 'block', width: 'fit-content', marginInline: 'auto', marginBottom: 4 } }}
				value={file?.name ?? ''}
				readOnly
				leftSection={file ? <IconFile size={16} /> : null}
				rightSectionWidth={file ? 260 : 130}
				rightSection={
					<Group gap={4} wrap={'nowrap'}>
						{file && (
							<Button
								size={'sm'}
								color={'red'}
								leftSection={<IconTrash size={16} />}
								onClick={() => setFile(null)}
							>
								Удалить
							</Button>
						)}
						<Button
							size={'sm'}
							variant={'filled'}
							leftSection={<IconFolder size={16} />}
							onClick={() => inputRef.current?.click()}
						>
							Выбрать ...
						</Button>
					</Group>
				}
				rightSectionPointerEvents={'auto'}
			/>
		</Container>
	)
}
