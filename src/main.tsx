/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createRoot } from 'react-dom/client'
import { App } from './components/App'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(<App word1="one" word2="two" />)
