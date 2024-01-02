export const getComponentTemplate = (pascalCaseName) => {
  return `
  import { useState } from 'react'\n
  export function ${pascalCaseName}() {\n
  const [count, setCount] = useState(0)
    return (
      <div>
      <h1>${pascalCaseName}</h1>
      <button type="button" onClick={() => setCount((prevCount) => prevCount + 1)}>
        Count is: {count}
      </button>
      </div>
    
    )\n}`;
};

export const getMainTemplate = (pascalCaseName) => {
  return `import { createRoot } from 'react-dom/client'
import { ${pascalCaseName} } from './components/${pascalCaseName}'

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(<${pascalCaseName} />)`;
};
