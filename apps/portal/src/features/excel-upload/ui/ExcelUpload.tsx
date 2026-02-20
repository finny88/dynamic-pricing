import { useRef, useState } from 'react'
import { Alert, Button, Container, Group, TextInput, Title } from '@mantine/core'
import { IconFile, IconFolder, IconTrash } from '@tabler/icons-react'
import type * as z from 'zod'
import type { Unit } from '@entities/unit'
import { parseFile, parseFilePreview } from '../lib/parseFile'
import type { FilePreview, RowValidationError } from '../lib/parseFile'
import { FilePreviewTable } from './FilePreviewTable'

const ACCEPT = '.xls,.xlsx,.csv'

interface Props {
	onSuccess: (units: Unit[]) => void
}

export const ExcelUpload = ({ onSuccess }: Props) => {
	const [file, setFile] = useState<File | null>(null)
	const [preview, setPreview] = useState<FilePreview | null>(null)
	const [loading, setLoading] = useState(false)
	const [invalid, setInvalid] = useState<RowValidationError[] | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const handleFileChange = async (selected: File) => {
		setFile(selected)
		setInvalid(null)
		const filePreview = await parseFilePreview(selected)
		setPreview(filePreview)
	}

	const handleParse = async (columnMapping: Record<string, string>, schema: z.ZodType) => {
		if (!file) {
			return
		}
		setLoading(true)
		try {
			const parsed = await parseFile(
				file, columnMapping, schema
			)
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
		<>
			<Container pb={'sm'}>
				<input
					ref={inputRef}
					type={'file'}
					accept={ACCEPT}
					style={{ display: 'none' }}
					onChange={(e) => {
						const selected = e.target.files?.[0]
						if (selected) { void handleFileChange(selected) }
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
										setPreview(null)
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
			</Container>
			{(
				preview || (invalid !== null && invalid.length > 0)
			) && (
				<Container size={'fluid'} px={'md'} pb={'sm'} style={{ flex: '0 1 auto', overflow: 'auto' }}>
					{preview && <FilePreviewTable preview={preview} loading={loading} onParse={(columnMapping, schema) => { void handleParse(columnMapping, schema) }} />}
					{invalid !== null && invalid.length > 0 && (
						<Alert variant={'light'} color={'red'}>
							<pre style={{ margin: 0 }}>{JSON.stringify(
								invalid, null, 2
							)}</pre>
						</Alert>
					)}
				</Container>
			)}
		</>
	)
}
