import { createContext } from 'react'
import type { Unit } from './unit'

export interface UnitsContextValue {
	units: Unit[] | null
	mappedRawKeys: Set<string> | null
	setUnits: (units: Unit[], mappedRawKeys: Set<string>) => void
	clearUnits: () => void
}

export const UnitsContext = createContext<UnitsContextValue>({
	units: null,
	mappedRawKeys: null,
	setUnits: () => {},
	clearUnits: () => {},
})
