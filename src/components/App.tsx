import { useState } from 'react'
import { AppProps } from './types'

export function App({ word1, word2 }: AppProps) {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h2>word1:</h2>
      <span>{word1}</span>
      <h2>word2</h2>
      <span>{word2}</span>
      <hr />
      <button type="button" onClick={() => setCount((prevCount) => prevCount + 1)}>
        Count is: {count}
      </button>
    </div>
  )
}
