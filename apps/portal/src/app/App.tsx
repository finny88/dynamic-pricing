import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { theme } from '@shared/config/theme'
import { UnitsProvider } from '@entities/unit'
import { routes } from './routes'

const App = () => {
	return (
		<MantineProvider theme={theme}>
			<Notifications />
			<BrowserRouter>
				<UnitsProvider>
					<Routes>
						{routes.map(({ path, element }) => (
							<Route key={path} path={path} element={element} />
						))}
					</Routes>
				</UnitsProvider>
			</BrowserRouter>
		</MantineProvider>
	)
}

export default App
