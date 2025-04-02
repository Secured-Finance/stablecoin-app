<div align="center">

<img src="src/assets/img/usdfc-logo.svg" width="328" />

<br/><br/>
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/Secured-Finance/stablecoin-app) ![GitHub License](https://img.shields.io/github/license/Secured-Finance/stablecoin-app)

# Secured Finance Stablecoin App
A decentralized application (dApp) for interacting with Secured Finance's stablecoin protocol, featuring the USDFC stablecoin backed by Filecoin. This app enables users to mint, redeem, and manage stablecoins, as well as participate in fixed-income lending markets on the Filecoin Virtual Machine (FVM).

### Quick Links
[![Static Badge](https://img.shields.io/badge/Homepage-5162FF?style=for-the-badge)](https://docs.secured.finance/usdfc-stablecoin-protocol/introduction)
[![Static Badge](https://img.shields.io/badge/Trading_Platform-white?style=for-the-badge)](https://app.usdfc.net)
[![Static Badge](https://img.shields.io/badge/Docs-11CABE?style=for-the-badge)](https://docs.secured.finance/)

</div>

## 📋 Overview

The Secured Finance Stablecoin App is a comprehensive platform that enables users to:
- Mint and redeem USDFC stablecoins
- Participate in fixed-income lending markets
- Manage stablecoin positions
- Interact with the Filecoin Virtual Machine (FVM) ecosystem

## 🚀 Getting Started

### Prerequisites
- Node.js (version specified in `.nvmrc`)
- npm or yarn package manager
- Git
- MetaMask or another Web3 wallet

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Secured-Finance/stablecoin-app.git
   cd stablecoin-app
   ```

2. Login to the GitHub npm package repository:
   ```bash
   npm login --registry=https://npm.pkg.github.com
   ```

3. Create a `.env.local` file:
   ```bash
   cp .env.local.sample .env.local
   ```
   Then configure your environment variables in `.env.local`

4. Set your GitHub personal access token:
   ```bash
   export NPM_AUTH_TOKEN=<your access token>
   ```

5. Use the correct Node.js version:
   ```bash
   nvm use
   ```

6. Install dependencies:
   ```bash
   npm install
   ```

7. Start the development server:
   ```bash
   npm run start
   ```

## 🛠️ Development Environment

### Recommended VS Code Extensions
- ESLint
- Prettier
- TailwindCSS Intellisense
- Code Spell Checker

These extensions are configured in `.vscode/settings.json` to ensure consistent code formatting and quality.

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
