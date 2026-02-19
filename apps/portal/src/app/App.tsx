import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { theme } from '@shared/config/theme'
import { routes } from './routes'

const App = () => {
	return (
		<MantineProvider theme={theme}>
			<BrowserRouter>
				<Routes>
					{routes.map(({ path, element }) => (
						<Route key={path} path={path} element={element} />
					))}
				</Routes>
			</BrowserRouter>
		</MantineProvider>
	)
}

export default App
