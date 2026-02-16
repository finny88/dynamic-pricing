import '@mantine/core/styles.css'
import units from '@shared/assets/input.json'
import {
	MantineProvider
} from '@mantine/core'
import { theme } from '@shared/theme'
import { BuildingViewer } from '@widgets/BuildingViewer'

const App = () => {
	return (
		<MantineProvider theme={theme}>
			<BuildingViewer units={units} />
		</MantineProvider>
	)
}

export default App
