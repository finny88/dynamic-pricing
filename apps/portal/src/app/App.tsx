import '@mantine/core/styles.css'
import units from '@shared/assets/input.json'
import {
	MantineProvider
} from '@mantine/core'
import { theme } from '@shared/theme'
import { FloorSectionGrid } from '@widgets/FloorSectionGrid'

const App = () => {
	return (
		<MantineProvider theme={theme}>
			<FloorSectionGrid units={units} />
		</MantineProvider>
	)
}

export default App
