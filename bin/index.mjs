#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';

import { exec } from 'child_process';
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

const gitRepoUrl = 'https://github.com/johnroma/react-component-standalone';
const cloneFolderPath = path.resolve(pascalCaseName);

async function cloneRepo() {
  return new Promise((resolve, reject) => {
    exec(`git clone ${gitRepoUrl} ${cloneFolderPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error cloning repo: ${error}`);
        reject(error);
      }
      console.log(`Repository cloned into ${cloneFolderPath}`);
      resolve(stdout);
    });
  });
}

async function promptAndUpdatePackageJson() {
    const packageJsonPath = path.join(cloneFolderPath, 'package.json');
    const packageJsonData = await fs.readFile(packageJsonPath, 'utf8');
    let packageJson = JSON.parse(packageJsonData);
  
    const answers = await inquirer.prompt([
      { name: 'name', message: 'Package name:', default: packageJson.name },
      { name: 'repository', message: 'Repository URL:', default: packageJson.repository.url },
      { name: 'authorName', message: 'Author name:', default: packageJson.author.name },
      { name: 'authorEmail', message: 'Author email:', default: packageJson.author.email },
      { name: 'keywords', message: 'Keywords (comma-separated):', default: packageJson.keywords.join(', ') }
    ]);
  
    packageJson = {
      ...packageJson,
      name: answers.name,
      version: '0.0.1',
      repository: { ...packageJson.repository, url: answers.repository },
      author: { name: answers.authorName, email: answers.authorEmail },
      keywords: answers.keywords.split(',').map(k => k.trim())
    };
  
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json with new information.');
  }
  

async function createComponentFiles() {
  try {
    // Change working directory to the cloned folder
    process.chdir(cloneFolderPath);

    const componentsFolderPath = path.resolve('./src/components');
    const componentFilePath = path.join(componentsFolderPath, `${pascalCaseName}.tsx`);
    const indexFilePath = path.join(componentsFolderPath, 'index.ts');
    const mainFilePath = path.resolve('./src', 'main.tsx');

    const componentContent = getComponentTemplate(pascalCaseName);
    const indexContent = `export { ${pascalCaseName} } from './${pascalCaseName}'`;
    const mainContent = getMainTemplate(pascalCaseName);

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

// First clone the repo, then create component files
cloneRepo()
  .then(promptAndUpdatePackageJson)
  .then(createComponentFiles)
  .catch(err => console.error(err));
