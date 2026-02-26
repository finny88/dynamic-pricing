import { configureStore } from '@reduxjs/toolkit'
import { projectsApi } from '@entities/project'
import { buildingsApi } from '@entities/building'
import { errorMiddleware } from '@shared/api'

export const store = configureStore({
	reducer: {
		[projectsApi.reducerPath]: projectsApi.reducer,
		[buildingsApi.reducerPath]: buildingsApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			projectsApi.middleware,
			buildingsApi.middleware,
			errorMiddleware,
		),
})
