import { Button, Group, TextInput, Title } from '@mantine/core'
import { IconFile, IconFolder, IconTrash } from '@tabler/icons-react'
import { useRef } from 'react'
import classes from './FileInput.module.css'

const ACCEPT = '.xls,.xlsx,.csv'

interface Props {
	file: File | null
	loading: boolean
	onFileChange: (file: File) => void
	onClear: () => void
}

export const FileInput = ({ file, loading, onFileChange, onClear }: Props) => {
	const inputRef = useRef<HTMLInputElement>(null)

	return (
		<Group align={'flex-end'} wrap={'nowrap'} gap={'xs'}>
			<input
				ref={inputRef}
				type={'file'}
				accept={ACCEPT}
				className={classes.hiddenInput}
				onChange={(e) => {
					const selected = e.target.files?.[0]
					if (selected) { onFileChange(selected) }
					e.target.value = ''
				}}
			/>
			<TextInput
				label={<Title order={3}>Загрузить файл</Title>}
				classNames={{ label: classes.fileInputLabel, root: classes.fileInputRoot }}
				value={file?.name ?? ''}
				readOnly
				disabled={loading}
				leftSection={file ? <IconFile size={16} /> : null}
			/>
			{file && (
				<Button
					size={'sm'}
					color={'red'}
					disabled={loading}
					leftSection={<IconTrash size={16} />}
					onClick={onClear}
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
	)
}
