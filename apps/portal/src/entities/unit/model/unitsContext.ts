import { createContext } from 'react'
import type { Unit } from './unit'

export interface UnitsContextValue {
	units: Unit[] | null
	setUnits: (units: Unit[]) => void
	clearUnits: () => void
}

export const UnitsContext = createContext<UnitsContextValue>({
	units: null,
	setUnits: () => {},
	clearUnits: () => {},
})
