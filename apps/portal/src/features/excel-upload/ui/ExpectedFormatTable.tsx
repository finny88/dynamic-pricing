import { Table, Text } from '@mantine/core'
import { RAW_UNIT_KEYS, rawUnitSchema } from '@entities/unit'
import styles from './FilePreviewTable.module.css'

const REQUIRED_KEYS = new Set(Object.keys(rawUnitSchema.shape))
const SORTED_KEYS = [
	...RAW_UNIT_KEYS.filter((key) => REQUIRED_KEYS.has(key)),
	...RAW_UNIT_KEYS.filter((key) => !REQUIRED_KEYS.has(key)),
]
const EMPTY_ROWS = Array.from({ length: 5 }, (_, i) => i)

export const ExpectedFormatTable = () => (
	<div className={styles.wrapper}>
		<Text size={'sm'} c={'dimmed'} mb={'xs'}>
			Ожидаемый формат
		</Text>
		<div className={styles.scroll}>
			<Table withTableBorder withColumnBorders className={styles.table}>
				<Table.Thead>
					<Table.Tr>
						<Table.Th className={styles.lineNumberCell} />
						{SORTED_KEYS.map((key) => (
							<Table.Th
								key={key}
								className={REQUIRED_KEYS.has(key) ? styles.expectedThRequired : styles.expectedTh}
							>
								{key}
							</Table.Th>
						))}
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{EMPTY_ROWS.map((i) => (
						<Table.Tr key={i}>
							<Table.Td className={styles.lineNumberCell}>{i + 1}</Table.Td>
							{SORTED_KEYS.map((key) => (
								<Table.Td key={key} className={styles.td} />
							))}
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</div>
	</div>
)
