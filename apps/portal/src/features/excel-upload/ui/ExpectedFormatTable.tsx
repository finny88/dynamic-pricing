import { useState } from 'react'
import { CloseButton, Group, Table, Text } from '@mantine/core'
import { RAW_UNIT_KEYS, rawUnitSchema } from '@entities/unit'
import styles from './FilePreviewTable.module.css'

const REQUIRED_KEYS = new Set(Object.keys(rawUnitSchema.shape))
const SORTED_KEYS = [
	...RAW_UNIT_KEYS.filter((key) => REQUIRED_KEYS.has(key)),
	...RAW_UNIT_KEYS.filter((key) => !REQUIRED_KEYS.has(key)),
]
const EMPTY_ROWS = Array.from({ length: 5 }, (_, i) => i)

interface Props {
	rows: unknown[][]
	header: string[]
	mapping: Record<string, number>
	onDrop: (targetKey: string, sourceIndex: number) => void
	onRemoveMapping: (key: string) => void
}

export const ExpectedFormatTable = ({ rows, header, mapping, onDrop, onRemoveMapping }: Props) => {
	const [dragOverKey, setDragOverKey] = useState<string | null>(null)

	const hasMappings = Object.keys(mapping).length > 0

	return (
		<div className={styles.wrapper}>
			<Text size={'sm'} c={'dimmed'} mb={'xs'}>
				Ожидаемый формат
			</Text>
			<div className={styles.scroll}>
				<Table withTableBorder withColumnBorders className={styles.table}>
					<Table.Thead>
						<Table.Tr>
							<Table.Th className={styles.lineNumberCell} />
							{SORTED_KEYS.map((key) => {
								const isOver = dragOverKey === key
								const baseClass = REQUIRED_KEYS.has(key) ? styles.expectedThRequired : styles.expectedTh
								return (
									<Table.Th
										key={key}
										className={isOver ? `${baseClass} ${styles.dropTarget}` : baseClass}
										onDragOver={(e) => { e.preventDefault(); setDragOverKey(key) }}
										onDragLeave={() => setDragOverKey(null)}
										onDrop={(e) => {
											e.preventDefault()
											setDragOverKey(null)
											onDrop(key, Number(e.dataTransfer.getData('text/plain')))
										}}
									>
										{key}
									</Table.Th>
								)
							})}
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{hasMappings && (
							<Table.Tr>
								<Table.Td className={styles.lineNumberCell} />
								{SORTED_KEYS.map((key) => (
									<Table.Td key={key} className={styles.mappingCell}>
										{mapping[key] !== undefined && (
											<Group gap={4} wrap={'nowrap'}>
												<Text size={'xs'} truncate flex={1}>
													{header[mapping[key]]}
												</Text>
												<CloseButton size={'xs'} onClick={() => onRemoveMapping(key)} />
											</Group>
										)}
									</Table.Td>
								))}
							</Table.Tr>
						)}
						{EMPTY_ROWS.map((i) => (
							<Table.Tr key={i}>
								<Table.Td className={styles.lineNumberCell}>{i + 1}</Table.Td>
								{SORTED_KEYS.map((key) => (
									<Table.Td key={key} className={styles.td}>
										{mapping[key] !== undefined ? String(rows[i]?.[mapping[key]] ?? '') : ''}
									</Table.Td>
								))}
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</div>
		</div>
	)
}
