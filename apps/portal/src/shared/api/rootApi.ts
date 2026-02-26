import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from './axiosBaseQuery'

export const rootApi = createApi({
	reducerPath: 'api',
	baseQuery: axiosBaseQuery(),
	endpoints: () => ({}),
})
