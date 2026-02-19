import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Unit } from './unit'
import { UnitsContext } from './unitsContext'

export const UnitsProvider = ({ children }: { children: ReactNode }) => {
	const [units, setUnits] = useState<Unit[] | null>(null)

	return (
		<UnitsContext.Provider value={{ units, setUnits }}>
			{children}
		</UnitsContext.Provider>
	)
}
