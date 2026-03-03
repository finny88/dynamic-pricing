import {
	Button,
	Container,
	Divider,
	Skeleton,
	Stack,
	Title,
} from '@mantine/core'
import { IconArrowLeft, IconPlus } from '@tabler/icons-react'
import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetBuildingByIdQuery, BuildingPageHeader } from '@entities/building'
import { useGetProjectQuery } from '@entities/project'
import type { UnitLayout } from '@entities/unit-layout'
import { useGetLayoutsByBuildingQuery } from '@entities/unit-layout'
import { DeleteModal } from './DeleteModal'
import { EditLayoutModal } from './EditLayoutModal'
import { CreateLayoutModal, type CreateLayoutModalHandle } from './LayoutModal'
import { LayoutsTable } from './LayoutsTable'
import { UnitSelectionModal } from './UnitSelectionModal'

export const BuildingLayoutsPage = () => {
	const { projectId, buildingId } = useParams<{ projectId: string; buildingId: string }>()
	const navigate = useNavigate()
	const pid = projectId ?? ''
	const bid = buildingId ?? ''

	const { data: building = null, isLoading: buildingLoading, error: buildingError } =
		useGetBuildingByIdQuery({ projectId: pid, buildingId: bid }, { skip: !pid || !bid })
	const { data: project } = useGetProjectQuery(pid, { skip: !pid })
	const { data: layouts = [] } = useGetLayoutsByBuildingQuery({ projectId: pid, buildingId: bid }, { skip: !pid || !bid })

	const createModalRef = useRef<CreateLayoutModalHandle>(null)
	const [editingLayout, setEditingLayout] = useState<UnitLayout | null>(null)
	const [deletingLayout, setDeletingLayout] = useState<UnitLayout | null>(null)
	const [selectionLayout, setSelectionLayout] = useState<UnitLayout | null>(null)

	if (buildingLoading) {
		return (
			<Container size={'xl'} pt={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
				<Stack gap={'lg'}>
					<Skeleton h={32} w={200} />
					<Skeleton h={80} />
					<Divider />
					<Skeleton h={400} />
				</Stack>
			</Container>
		)
	}

	if (buildingError || !building) {
		return (
			<Container size={'xl'} pt={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
				<Stack align={'center'} pt={'xl'} gap={8}>
					<Title order={3} c={'dimmed'}>Дом не найден</Title>
					<Button variant={'subtle'} leftSection={<IconArrowLeft size={16} />} onClick={() => navigate(`/projects/${pid}`)}>
						Вернуться к проекту
					</Button>
				</Stack>
			</Container>
		)
	}

	const sortedLayouts = [...layouts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

	return (
		<>
			<Container size={'xl'} pt={{ base: 'md', sm: 'lg', md: 'xl' }} px={{ base: 'md', sm: 'lg', md: 'xl' }}>
				<BuildingPageHeader
					building={building}
					projectId={pid}
					projectName={project?.name ?? ''}
					buildingLink={`/projects/${pid}/buildings/${bid}`}
				/>

				<Stack gap={'md'}>
					<Button leftSection={<IconPlus size={16} />} onClick={() => createModalRef.current?.open()} w={'fit-content'}>
						Добавить планировку
					</Button>

					<LayoutsTable
						layouts={sortedLayouts}
						onEdit={setEditingLayout}
						onDelete={setDeletingLayout}
						onUnitSel={setSelectionLayout}
					/>
				</Stack>
			</Container>

			<CreateLayoutModal ref={createModalRef} projectId={pid} buildingId={bid} />
			{editingLayout && (
				<EditLayoutModal
					layout={editingLayout}
					projectId={pid}
					buildingId={bid}
					onClose={() => setEditingLayout(null)}
				/>
			)}
			{deletingLayout && (
				<DeleteModal
					layout={deletingLayout}
					projectId={pid}
					buildingId={bid}
					onClose={() => setDeletingLayout(null)}
				/>
			)}
			{selectionLayout && (
				<UnitSelectionModal
					layout={selectionLayout}
					buildingUnits={building.units}
					projectId={pid}
					buildingId={bid}
					onClose={() => setSelectionLayout(null)}
				/>
			)}
		</>
	)
}
