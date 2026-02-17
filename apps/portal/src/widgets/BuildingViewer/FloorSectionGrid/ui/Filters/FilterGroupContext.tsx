import { createContext } from 'react'

interface FilterGroupContextValue {
	openedId: string | null
	setOpenedId: (id: string | null) => void
}

export const FilterGroupContext = createContext<FilterGroupContextValue>({
	openedId: null,
	setOpenedId: () => {}
})
