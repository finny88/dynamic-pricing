import { useRef, useState } from 'react'
import { Alert, Button, Container, Group, TextInput, Title } from '@mantine/core'
import { IconFile, IconFolder, IconTrash } from '@tabler/icons-react'
import type { Unit } from '@entities/unit'
import { parseFile } from '../lib/parseFile'
import type { RowValidationError } from '../lib/parseFile'

const ACCEPT = '.xls,.xlsx,.csv'

interface Props {
	onSuccess: (units: Unit[]) => void
}

export const ExcelUpload = ({ onSuccess }: Props) => {
	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)
	const [invalid, setInvalid] = useState<RowValidationError[] | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const handleParse = async () => {
		if (!file) {
			return
		}
		setLoading(true)
		try {
			const parsed = await parseFile(file)
			if (parsed.errors.length > 0) {
				setInvalid(parsed.errors)
			} else {
				onSuccess(parsed.data)
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<Container pb={'sm'} style={{ display: 'flex', flexDirection: 'column', height: invalid !== null && invalid.length > 0 ? '100vh' : undefined }}>
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
				disabled={loading}
				leftSection={file ? <IconFile size={16} /> : null}
				rightSection={
					<Group gap={4} wrap={'nowrap'}>
						{file && (
							<Button
								size={'sm'}
								color={'red'}
								disabled={loading}
								leftSection={<IconTrash size={16} />}
								onClick={() => {
									setFile(null)
									setInvalid(null)
								}}
							>
								Удалить
							</Button>
						)}
						<Button
							size={'sm'}
							variant={'filled'}
							disabled={loading}
							leftSection={<IconFolder size={16} />}
							onClick={() => inputRef.current?.click()}
						>
							Выбрать ...
						</Button>
					</Group>
				}
				rightSectionPointerEvents={'auto'}
			/>
			<Button
				variant={'filled'}
				mt={'sm'}
				style={{ width: 'fit-content', flexShrink: 0 }}
				disabled={!file}
				loading={loading}
				onClick={() => { void handleParse() }}
			>
				Загрузить файл
			</Button>
			{invalid !== null && invalid.length > 0 && (
				<Alert variant={'light'} color={'red'} mt={'sm'} style={{ flex: '0 1 auto', overflow: 'auto' }}>
					<pre style={{ margin: 0 }}>{JSON.stringify(
						invalid, null, 2
					)}</pre>
				</Alert>
			)}
		</Container>
	)
}
