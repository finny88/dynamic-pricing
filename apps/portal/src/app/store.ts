import { configureStore } from '@reduxjs/toolkit'
import { projectsApi } from '@entities/project'
import { errorMiddleware } from '@shared/api'

export const store = configureStore({
	reducer: {
		[projectsApi.reducerPath]: projectsApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(projectsApi.middleware, errorMiddleware),
})
