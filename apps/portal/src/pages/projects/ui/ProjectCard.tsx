import { ActionIcon, Badge, Card, Divider, Group, Menu, Stack, Text } from '@mantine/core'
import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { housingClassLabels, type Project } from '@entities/project'
import { LocationText } from '@shared/ui/LocationText'
import classes from './ProjectCard.module.css'

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

interface Props {
	project: Project
	onEdit: (project: Project) => void
	onDelete: (project: Project) => void
}

export const ProjectCard = ({ project, onEdit, onDelete }: Props) => {
	const navigate = useNavigate()

	return (
		<Card
			shadow={'sm'}
			padding={'lg'}
			radius={'md'}
			withBorder
			className={classes.card}
			onClick={() => navigate(`/projects/${project.id}`)}
		>
			<Stack gap={'sm'}>
				<Group justify={'space-between'} align={'center'} wrap={'nowrap'}>
					<Text fw={600} size={'md'} truncate>
						{project.name}
					</Text>
					<div onClick={(e) => e.stopPropagation()}>
						<Menu position={'bottom-end'} withinPortal>
							<Menu.Target>
								<ActionIcon variant={'subtle'} color={'gray'} size={'sm'}>
									<IconDots size={16} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item leftSection={<IconPencil size={14} />} onClick={() => onEdit(project)}>
									Редактировать
								</Menu.Item>
								<Menu.Item leftSection={<IconTrash size={14} />} color={'red'} onClick={() => onDelete(project)}>
									Удалить
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					</div>
				</Group>

				<LocationText locationParts={[project.region, project.area, project.city]} />

				<Group gap={'lg'}>
					<Text size={'sm'} c={'dimmed'}>{project.buildingsCount} корп.</Text>
					<Text size={'sm'} c={'dimmed'}>{project.lotsCount} кв.</Text>
					<Text size={'sm'} c={'dimmed'}>{project.totalArea} м²</Text>
				</Group>

				<Divider />

				<Group justify={'space-between'} align={'center'}>
					{project.housingClass && (
						<Badge variant={'outline'} color={'gray'} size={'sm'}>
							{housingClassLabels[project.housingClass] ?? project.housingClass}
						</Badge>
					)}
					<Text size={'xs'} c={'dimmed'} ml={'auto'}>
						Обновлено: {formatDate(project.updatedAt)}
					</Text>
				</Group>
			</Stack>
		</Card>
	)
}
