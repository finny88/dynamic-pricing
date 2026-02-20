import { useState } from 'react'
import { CloseButton, Group, Table, Text } from '@mantine/core'
import { RAW_UNIT_KEYS } from '@entities/unit'
import { REQUIRED_KEYS } from '../lib/requiredKeys'
import styles from './FilePreviewTable.module.css'

const SORTED_KEYS = [
	...RAW_UNIT_KEYS.filter((key) => REQUIRED_KEYS.has(key)),
	...RAW_UNIT_KEYS.filter((key) => !REQUIRED_KEYS.has(key)),
]
const EMPTY_ROWS = Array.from({ length: 5 }, (_, i) => i)

interface Props {
	rows: unknown[][]
	header: string[]
	mapping: Record<string, string>
	onDrop: (targetKey: string, sourceHeaderName: string) => void
	onRemoveMapping: (key: string) => void
}

export const ExpectedFormatTable = ({ rows, header, mapping, onDrop, onRemoveMapping }: Props) => {
	const [dragOverKey, setDragOverKey] = useState<string | null>(null)

	const hasMappings = Object.keys(mapping).length > 0

	const dropProps = (key: string) => ({
		onDragOver: (e: React.DragEvent) => { e.preventDefault(); setDragOverKey(key) },
		onDragLeave: () => setDragOverKey(null),
		onDrop: (e: React.DragEvent) => {
			e.preventDefault()
			setDragOverKey(null)
			onDrop(key, e.dataTransfer.getData('text/plain'))
		},
	})

	const colClass = (key: string, base: string) =>
		dragOverKey === key ? `${base} ${styles.dropTarget}` : base

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
								const baseClass = REQUIRED_KEYS.has(key) ? styles.expectedThRequired : styles.expectedTh
								return (
									<Table.Th
										key={key}
										className={colClass(key, baseClass)}
										{...dropProps(key)}
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
									<Table.Td
										key={key}
										className={colClass(key, styles.mappingCell)}
										{...dropProps(key)}
									>
										{mapping[key] !== undefined && (
											<Group gap={4} wrap={'nowrap'}>
												<Text size={'xs'} truncate flex={1}>
													{mapping[key]}
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
								{SORTED_KEYS.map((key) => {
									const colIndex = mapping[key] !== undefined ? header.indexOf(mapping[key]) : -1
									return (
										<Table.Td
											key={key}
											className={colClass(key, styles.td)}
											{...dropProps(key)}
										>
											{colIndex >= 0 ? String(rows[i]?.[colIndex] ?? '') : ''}
										</Table.Td>
									)
								})}
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</div>
		</div>
	)
}
