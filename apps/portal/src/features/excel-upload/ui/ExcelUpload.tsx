import { useRef, useState } from 'react'
import { ActionIcon, Button, Container, Group, Modal, ScrollArea, Table, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { IconCopy, IconFile, IconFolder, IconTrash } from '@tabler/icons-react'
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
	const [errorsModalOpen, setErrorsModalOpen] = useState(false)
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
				setErrorsModalOpen(true)
			} else {
				onSuccess(parsed.data)
			}
		} finally {
			setLoading(false)
		}
	}

	const handleCopyErrors = () => {
		const text = JSON.stringify(
			invalid, null, 2
		)
		void navigator.clipboard.writeText(text)
	}

	return (
		<>
			<Modal
				opened={errorsModalOpen}
				onClose={() => setErrorsModalOpen(false)}
				title={
					<Group gap={'xs'}>
						<Text c={'red'} fw={600}>Ошибки валидации</Text>
						<Tooltip label={'Скопировать'}>
							<ActionIcon
								variant={'subtle'}
								color={'gray'}
								onClick={handleCopyErrors}
							>
								<IconCopy size={16} />
							</ActionIcon>
						</Tooltip>
					</Group>
				}
				size={'lg'}
				centered
				scrollAreaComponent={ScrollArea.Autosize}
			>
				<Table striped withTableBorder>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Строка</Table.Th>
							<Table.Th>Колонка</Table.Th>
							<Table.Th>Ошибка</Table.Th>
							<Table.Th>Значение</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{invalid?.map((err, i) => (
							<Table.Tr key={i}>
								<Table.Td>{err.row}</Table.Td>
								<Table.Td>{err.column}</Table.Td>
								<Table.Td>{err.message}</Table.Td>
								<Table.Td>{String(err.value ?? '')}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
				<Button mt={'md'} color={'red'} onClick={() => setErrorsModalOpen(false)}>
					Закрыть
				</Button>
			</Modal>
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
			{preview && (
				<Container size={'fluid'} px={'md'} pb={'sm'} style={{ flex: '0 1 auto', overflow: 'auto' }}>
					<FilePreviewTable preview={preview} loading={loading} onParse={(columnMapping, schema) => { void handleParse(columnMapping, schema) }} />
				</Container>
			)}
		</>
	)
}
