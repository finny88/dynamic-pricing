import { configureStore } from '@reduxjs/toolkit'
import { projectsApi } from '@entities/project'

export const store = configureStore({
	reducer: {
		[projectsApi.reducerPath]: projectsApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(projectsApi.middleware),
})
