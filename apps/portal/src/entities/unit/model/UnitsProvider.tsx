import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Unit } from './unit'
import { UnitsContext } from './unitsContext'

export const UnitsProvider = ({ children }: { children: ReactNode }) => {
	const [units, setUnitsState] = useState<Unit[] | null>(null)
	const [mappedRawKeys, setMappedRawKeys] = useState<Set<string> | null>(null)

	const setUnits = (nextUnits: Unit[], nextKeys: Set<string>) => {
		setUnitsState(nextUnits)
		setMappedRawKeys(nextKeys)
	}

	const clearUnits = () => {
		setUnitsState(null)
		setMappedRawKeys(null)
	}

	return (
		<UnitsContext.Provider value={{ units, mappedRawKeys, setUnits, clearUnits }}>
			{children}
		</UnitsContext.Provider>
	)
}
