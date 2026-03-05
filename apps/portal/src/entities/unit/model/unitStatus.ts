export type UnitStatus = 'available' | 'reserved' | 'onhold' | 'sold' | 'unknown'

export const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
	available: 'Свободно',
	reserved: 'Бронь',
	onhold: 'Резерв',
	sold: 'Продано',
	unknown: 'Неизвестно',
}

export const UNIT_STATUS_TOOLTIPS: Record<UnitStatus, string> = {
	available: 'Доступно для бронирования клиентом',
	reserved: 'Забронировано клиентом под сделку',
	onhold: 'Резерв застройщика (временно недоступно для брони)',
	sold: 'Продано (недоступно для брони)',
	unknown: 'Нет данных о статусе',
}
