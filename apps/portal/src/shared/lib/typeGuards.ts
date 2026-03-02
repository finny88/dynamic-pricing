export const isObjectOfTypeWithProperty = <P extends string>(
	obj: unknown,
	prop: P,
): obj is Record<P, unknown> => Object.prototype.hasOwnProperty.call(obj, prop)
