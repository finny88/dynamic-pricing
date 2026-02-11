import { useState } from 'react'
import ReactLogo from '@shared/assets/react.svg?react'
import viteLogo from '/vite.svg'
import '@mantine/core/styles.css'
import './App.css'

import {
	Button,
	MantineProvider
} from '@mantine/core'
import { theme } from './theme.ts'

const App = () => {
	const [count, setCount] = useState(0)

	return (
		<MantineProvider theme={theme}>
			<div>
				<a href={'https://vite.dev'} target={'_blank'}>
					<img src={viteLogo} className={'logo'} alt={'Vite logo'} />
				</a>
				<a href={'https://react.dev'} target={'_blank'}>
					<ReactLogo className={'logo react'} />
					{/* <img src={reactLogo} className={'logo react'} alt={'React logo'} /> */}
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className={'card'}>
				<Button variant={'filled'} onClick={() => setCount(prev => prev + 1)}>
					count is {count}
				</Button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className={'read-the-docs'}>
				Click on the Vite and React logos to learn more
			</p>
		</MantineProvider>
	)
}

export default App
