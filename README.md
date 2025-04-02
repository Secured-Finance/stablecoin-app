<div align="center">

<img src="src/assets/img/usdfc-logo.svg" width="328" />

<br/><br/>
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/Secured-Finance/stablecoin-app) ![GitHub License](https://img.shields.io/github/license/Secured-Finance/stablecoin-app)

A decentralized application (dApp) for interacting with Secured Finance's stablecoin protocol, featuring the USDFC stablecoin backed by Filecoin.

### Quick Links
[![Static Badge](https://img.shields.io/badge/Homepage-5162FF?style=for-the-badge)](https://docs.secured.finance/usdfc-stablecoin-protocol/introduction)
[![Static Badge](https://img.shields.io/badge/Trading_Platform-white?style=for-the-badge)](https://app.usdfc.net)
[![Static Badge](https://img.shields.io/badge/Docs-11CABE?style=for-the-badge)](https://docs.secured.finance/)

</div>


## ⚡️ Quick Start

1. Clone this repository
2. Login on the GitHub npm package repository with `npm login --registry=https://npm.pkg.github.com`
3. Create a file `.env.local` at the root of the project. Please refer to `.env.local.sample` for the list of environment variables
4. Run `nvm use` to ensure you are using the correct node version
5. Install all required dependencies by running `npm install`
6. Run `npm run start` to start development mode


## 🛠️ Recommended Development Environment
This repository provides a `.vscode/settings.json` which assumes you have the following extensions installed in your code editor:
- ESLint
- Prettier
- TailwindCSS Intellisense
- Code Spell Checker

Those extensions helps streamline the development process by creating a standard way of formatting the code.

## 🧪 Testing

### Unit Tests
Run the test suite:
```bash
npm run test
```

### Storybook
Launch the component development environment:
```bash
npm run storybook
```

## 🏗️ Tech Stack

Here's a brief high-level overview of the tech stack the Secured Finance App uses:

- [Next.js](https://nextjs.org/): A React framework that enables server-side rendering and simplifies the creation of performant web applications
- [Jest](https://jestjs.io/): Delightful JavaScript testing framework with a focus on simplicity and effectiveness, commonly used for unit and integration testing in React applications
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro): Facilitates user-centric testing in React applications by providing intuitive utilities for querying and interacting with components
- [Storybook](https://storybook.js.org/): Development environment for UI components, providing a sandboxed environment to visually develop and test components in isolation.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework that allows for rapid UI development by providing pre-defined utility classes for styling elements
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview): Powerful library for managing server-state and caching in React applications, providing a straightforward way to fetch, cache, and update asynchronous data in components
- [Redux](https://redux.js.org/): Predictable state container for JavaScript applications, commonly used with React to manage application state in a centralized manner
- [Wagmi](https://wagmi.sh/): A useful library of React Hooks for Ethereum

## 🔖️ License

This project is licensed under the MIT license, Copyright (c) 2024 Secured Finance. For more information see `LICENSE.md`.
