import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { Middleware } from '@reduxjs/toolkit'
import { notifications } from '@mantine/notifications'

interface ApiErrorPayload {
	data?: { error?: string }
}

const isApiErrorPayload = (payload: unknown): payload is ApiErrorPayload =>
	typeof payload === 'object' && payload !== null && 'data' in payload

export const errorMiddleware: Middleware = () => (next) => (action) => {
	if (isRejectedWithValue(action) && isApiErrorPayload(action.payload)) {
		notifications.show({
			color: 'red',
			title: 'Ошибка',
			message: action.payload.data?.error ?? 'Произошла ошибка',
		})
	}
	return next(action)
}
