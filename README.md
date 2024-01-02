# Standalone Component maker

Helper to generate a publishable react component

## Installation
```bash
npx @anthood/crc my-component
```

Follow instruction and provide
- NPM Package name
- Github URL (not required from NPM but would be nice if you have a public repo)
- Author name
- Author email
- Keywords (so that people find your package)

```bash
cd my-component
pnpm install
```
Your component is ready to be worked with and published!

## Usage

Spins up a React 18 environment to develop on your component
```bash
pnpm dev 
```
Under the components you will find a prepolated starter component
- /my-component
    - /src
        - /components
            - MyComponent.tsx

This is the entrypoint to what will be published on npm.

## Publish

When you are ready make sure to first build, then publish (provided you have an NPM account).

If needed bump your versions inside package.json, and replace the Readme.md

```bash
pnpm build
pnpm publish --access=public
```

## Importing into a project
Now you are set in any React project simply

```jsx
import { MyComponent } from "my-component"

function App() {
    return <MyComponent />
}
```