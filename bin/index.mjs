#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import { pascalCase, kebabCase } from 'change-case';
import { getComponentTemplate, getMainTemplate } from './templates.mjs';

const inputName = process.argv[2];

if (!inputName) {
  console.error('Please provide a name for the component.');
  process.exit(1);
}

const pascalCaseName = pascalCase(inputName);
const kebabCaseName = kebabCase(inputName);

const gitRepoUrl = 'https://github.com/johnroma/react-component-standalone';
const cloneFolderPath = path.resolve(kebabCaseName);

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
  try {
    const packageJsonPath = path.join(cloneFolderPath, 'package.json');
    const packageJsonData = await fs.readFile(packageJsonPath, 'utf8');
    let packageJson = JSON.parse(packageJsonData);

    const answers = await inquirer.prompt([
      { name: 'name', message: 'Package name:', default: kebabCaseName },
      { name: 'repository', message: 'Repository URL (optional):', default: null },
      { name: 'authorName', message: 'Author name:', default: packageJson.author.name },
      { name: 'authorEmail', message: 'Author email:', default: packageJson.author.email },
      { name: 'keywords', message: 'Keywords (comma-separated):', default: packageJson.keywords.join(', ') }
    ]);

    packageJson = {
      ...packageJson,
      name: answers.name,
      version: '0.0.1',
      author: { name: answers.authorName, email: answers.authorEmail },
      keywords: answers.keywords.split(',').map(k => k.trim())
    };

    if (answers.repository) {
      packageJson.repository = { url: answers.repository };
    } else {
      delete packageJson.repository;
    }

    delete packageJson.bin;

    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Updated package.json with new information.');

    const binPath = path.join(cloneFolderPath, 'bin');
    const githubPath = path.join(cloneFolderPath, '.github');

    await fs.rm(binPath, { recursive: true, force: true });
    await fs.rm(githubPath, { recursive: true, force: true });
    console.log('Cleanup unnecessary files.');
  } catch (err) {
    console.error('An error occurred during the cleanup process.');
    console.error(err.message);
  }
}

async function createComponentFiles() {
  try {
    process.chdir(cloneFolderPath);

    const componentsFolderPath = path.resolve('./src/components');
    const componentFilePath = path.join(componentsFolderPath, `${pascalCaseName}.tsx`);
    const indexFilePath = path.join(componentsFolderPath, 'index.ts');
    const mainFilePath = path.resolve('./src', 'main.tsx');

    const componentContent = getComponentTemplate(pascalCaseName);
    const indexContent = `export { ${pascalCaseName} } from './${pascalCaseName}'`;
    const mainContent = getMainTemplate(pascalCaseName);

    await fs.mkdir(componentsFolderPath, { recursive: true });

    await fs.writeFile(componentFilePath, componentContent);
    await fs.writeFile(indexFilePath, indexContent);
    await fs.writeFile(mainFilePath, mainContent);

    console.log(`Component ${pascalCaseName}.tsx ready for coding.`);
    console.log(`React-environment installed, run 'pnpm install to initialise` );
  } catch (err) {
    console.error('Error creating files:', err.message);
  }
}

cloneRepo()
  .then(promptAndUpdatePackageJson)
  .then(createComponentFiles)
  .catch(err => {
    console.error('Something went wrong, please try again.');
    console.error(err.message);
  });
