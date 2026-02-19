import { useContext } from 'react'
import { UnitsContext } from './unitsContext'

export const useUnits = () => useContext(UnitsContext)
