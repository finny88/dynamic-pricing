import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { theme } from '@shared/config/theme'
import { BuildingPage } from '@pages/building'
import { BuildingViewerPage } from '@pages/building-viewer'

const App = () => {
	return (
		<MantineProvider theme={theme}>
			<BrowserRouter>
				<Routes>
					<Route path={'/'} element={<BuildingPage />} />
					<Route path={'/viewer'} element={<BuildingViewerPage />} />
				</Routes>
			</BrowserRouter>
		</MantineProvider>
	)
}

export default App
