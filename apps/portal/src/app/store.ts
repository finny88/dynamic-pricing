import { configureStore } from '@reduxjs/toolkit'
import { rootApi, errorMiddleware } from '@shared/api'

export const store = configureStore({
	reducer: {
		[rootApi.reducerPath]: rootApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(rootApi.middleware, errorMiddleware),
})
