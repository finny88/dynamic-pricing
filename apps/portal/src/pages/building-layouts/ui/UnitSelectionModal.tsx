import { Box, Button, Group, LoadingOverlay, Modal, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import type { Unit } from '@entities/unit'
import type { UnitLayout } from '@entities/unit-layout'
import { useUpdateLayoutUnitsMutation } from '@entities/unit-layout'
import { FloorSectionGrid } from '@widgets/BuildingViewer'

interface Props {
	layout: UnitLayout
	buildingUnits: Unit[]
	projectId: string
	buildingId: string
	onClose: () => void
}

export const UnitSelectionModal = ({ layout, buildingUnits, projectId, buildingId, onClose }: Props) => {
	const [updateLayoutUnits, { isLoading }] = useUpdateLayoutUnitsMutation()
	const [opened, { close }] = useDisclosure(true)
	const [selected, setSelected] = useState<number[]>(layout.unitNumbers)
	const [confirmCancel, setConfirmCancel] = useState(false)

	const isDirty = [...selected].sort().join(',') !== [...layout.unitNumbers].sort().join(',')

	const handleCancel = () => {
		if (isDirty) {
			setConfirmCancel(true)
		} else {
			close()
		}
	}

	const handleConfirmCancel = () => {
		setConfirmCancel(false)
		close()
	}

	const handleSave = async () => {
		await updateLayoutUnits({ projectId, buildingId, layoutId: layout.id, unitNumbers: selected })
		close()
	}

	return (
		<>
			<Modal
				opened={opened}
				onClose={handleCancel}
				onExitTransitionEnd={onClose}
				title={'Укажите помещения, для которых необходимо применить планировку'}
				size={'auto'}
			>
				<Box pos={'relative'}>
					<LoadingOverlay visible={isLoading} />
					<Stack gap={'md'}>
						<FloorSectionGrid
							units={buildingUnits}
							selectionMode={true}
							selectedUnitNumbers={selected}
							onSelectionChange={setSelected}
						/>
						<Group justify={'flex-end'}>
							<Button variant={'default'} onClick={handleCancel}>Отмена</Button>
							<Button loading={isLoading} onClick={handleSave}>Сохранить</Button>
						</Group>
					</Stack>
				</Box>
			</Modal>

			<Modal
				opened={confirmCancel}
				onClose={() => setConfirmCancel(false)}
				title={'Вы уверены?'}
				size={'sm'}
			>
				<Stack gap={'md'}>
					<Text size={'sm'}>Сопоставление квартир будет потеряно</Text>
					<Group justify={'flex-end'}>
						<Button variant={'default'} onClick={() => setConfirmCancel(false)}>Отмена</Button>
						<Button color={'red'} onClick={handleConfirmCancel}>Подтвердить</Button>
					</Group>
				</Stack>
			</Modal>
		</>
	)
}
