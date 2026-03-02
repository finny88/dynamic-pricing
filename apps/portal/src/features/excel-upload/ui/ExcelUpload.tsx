import { Box, Container, LoadingOverlay } from '@mantine/core'
import { useState } from 'react'
import type * as z from 'zod'
import type { Unit } from '@entities/unit'
import { parseFile, parseFilePreview } from '../lib/parseFile'
import type { FilePreview, RowValidationError } from '../lib/parseFile'
import { FileInput } from './FileInput'
import { FilePreviewTable } from './FilePreviewTable'
import { ValidationErrorsModal } from './ValidationErrorsModal'

interface Props {
	onSuccess: (units: Unit[]) => void
}

export const ExcelUpload = ({ onSuccess }: Props) => {
	const [file, setFile] = useState<File | null>(null)
	const [preview, setPreview] = useState<FilePreview | null>(null)
	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState<RowValidationError[] | null>(null)

	const handleFileChange = async (selected: File) => {
		setFile(selected)
		setErrors(null)
		const filePreview = await parseFilePreview(selected)
		setPreview(filePreview)
	}

	const handleParse = async (mapping: Record<string, string>, schema: z.ZodType) => {
		if (!file) {
			return
		}
		setLoading(true)
		try {
			const parsed = await parseFile(
				file, mapping, schema
			)
			if (parsed.errors.length > 0) {
				setErrors(parsed.errors)
				setLoading(false)
			} else {
				onSuccess(parsed.data)
				// loading stays true — component is about to unmount
			}
		} catch {
			setLoading(false)
		}
	}

	return (
		<>
			{errors !== null && file !== null && (
				<ValidationErrorsModal
					onClose={() => setErrors(null)}
					errors={errors}
					file={file}
				/>
			)}
			<Box pos={'relative'}>
				<LoadingOverlay visible={loading} />
				<Container size={'xl'} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
					<FileInput
						file={file}
						loading={loading}
						onFileChange={(selected) => { void handleFileChange(selected) }}
						onClear={() => {
							setFile(null)
							setPreview(null)
							setErrors(null)
						}}
					/>
				</Container>
				{preview && (
					<Container fluid px={{ base: 'md', sm: 'lg', md: 'xl' }} mt={'md'}>
						<FilePreviewTable preview={preview} loading={loading} onParse={(mapping, schema) => { void handleParse(mapping, schema) }} />
					</Container>
				)}
			</Box>
		</>
	)
}
