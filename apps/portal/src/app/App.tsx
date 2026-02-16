import '@mantine/core/styles.css'
import units from '@shared/assets/input.json'
import {
	MantineProvider
} from '@mantine/core'
import { theme } from '@shared/theme'
import { TabsLayout } from '@widgets/TabsLayout'

const App = () => {
	return (
		<MantineProvider theme={theme}>
			<TabsLayout units={units} />
		</MantineProvider>
	)
}

export default App
