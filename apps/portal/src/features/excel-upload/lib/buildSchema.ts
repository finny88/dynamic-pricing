import * as z from 'zod'
import type { ZodType } from 'zod'
import { rawUnitSchema } from '@entities/unit'
import { isObjectOfTypeWithProperty } from '@shared/lib/typeGuards'

const isRawUnitSchemaKey = (key: string): key is keyof typeof rawUnitSchema.shape =>
	isObjectOfTypeWithProperty(rawUnitSchema.shape, key)

export const buildSchema = (mapping: Record<string, string>): ZodType => {
	const shape: Record<string, ZodType> = {}
	for (const [schemaKey, headerName] of Object.entries(mapping)) {
		if (isRawUnitSchemaKey(schemaKey)) {
			shape[headerName] = rawUnitSchema.shape[schemaKey]
		}
	}
	return z.object(shape).catchall(z.unknown())
}
