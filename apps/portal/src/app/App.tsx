import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { theme } from '@shared/config/theme'
import { UnitsProvider } from '@entities/unit'
import { routes } from './routes'
import { store } from './store'

const App = () => {
	return (
		<Provider store={store}>
			<MantineProvider theme={theme}>
				<Notifications />
				<BrowserRouter basename={import.meta.env.BASE_URL}>
					<UnitsProvider>
						<Routes>
							{routes.map(({ path, element }) => (
								<Route key={path} path={path} element={element} />
							))}
						</Routes>
					</UnitsProvider>
				</BrowserRouter>
			</MantineProvider>
		</Provider>
	)
}

export default App
