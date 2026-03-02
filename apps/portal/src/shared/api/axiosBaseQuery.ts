import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { isAxiosError } from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { axiosInstance } from './axiosInstance'

interface AxiosBaseQueryArgs {
	url: string
	method?: AxiosRequestConfig['method']
	data?: AxiosRequestConfig['data']
	params?: AxiosRequestConfig['params']
}

interface AxiosBaseQueryError {
	status: number | undefined
	data: unknown
}

export const axiosBaseQuery = (): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
	async ({ url, method = 'GET', data, params }) => {
		try {
			const result = await axiosInstance({ url, method, data, params })
			return { data: result.data }
		} catch (axiosError) {
			if (isAxiosError(axiosError)) {
				return {
					error: {
						status: axiosError.response?.status,
						data: axiosError.response?.data ?? axiosError.message,
					},
				}
			}
			return { error: { status: undefined, data: String(axiosError) } }
		}
	}
