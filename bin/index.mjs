import fs from 'fs/promises';
import path from 'path';
import { getComponentTemplate, getMainTemplate } from './templates.mjs';

const inputName = process.argv[2];

if (!inputName) {
  console.error('Please provide a name for the component.');
  process.exit(1);
}

const pascalCaseName = inputName
  .split(/[-\s]/)
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join('');

const componentsFolderPath = path.resolve('./src/components');
const componentFilePath = path.join(componentsFolderPath, `${pascalCaseName}.tsx`);
const indexFilePath = path.join(componentsFolderPath, 'index.ts');
const mainFilePath = path.resolve('./src', 'main.tsx');

const componentContent = getComponentTemplate(pascalCaseName);
const indexContent = `export { ${pascalCaseName} } from './${pascalCaseName}'`;
const mainContent = getMainTemplate(pascalCaseName);

async function createComponentFiles() {
  try {
    // Ensure the components folder exists
    await fs.mkdir(componentsFolderPath, { recursive: true });

    // Write the component, index, and main.tsx files
    await fs.writeFile(componentFilePath, componentContent);
    await fs.writeFile(indexFilePath, indexContent);
    await fs.writeFile(mainFilePath, mainContent);
    
    console.log(`Component ${pascalCaseName}.tsx, index.ts, and main.tsx created`);
  } catch (err) {
    console.error(`Error creating files: ${err}`);
  }
}

createComponentFiles();
