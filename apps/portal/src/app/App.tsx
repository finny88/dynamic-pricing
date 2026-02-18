import '@mantine/core/styles.css'
import {
	MantineProvider
} from '@mantine/core'
import { theme } from '@shared/theme'
import { BuildingPage } from '@pages/building/ui/BuildingPage'

const App = () => {
	return (
		<MantineProvider theme={theme}>
			<BuildingPage />
		</MantineProvider>
	)
}

export default App
