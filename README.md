# ng-pro-scaffold

[![npm version](https://badge.fury.io/js/ng-pro-scaffold.svg)](https://badge.fury.io/js/ng-pro-scaffold)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

**An opinionated Angular project scaffolding CLI with modern best practices**

## Features

- 🚀 **Quick Setup** - Generate a production-ready Angular project in seconds
- 🎨 **Tailwind CSS** - Optional Tailwind CSS integration for utility-first styling
- 🐳 **Docker Ready** - Optional Docker configuration with multi-stage builds
- 📦 **Angular Material** - Optional Angular Material component library
- 🔒 **Security First** - Input sanitization and secure command execution
- 🌍 **Cross-Platform** - Works on Windows, macOS, and Linux

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)
- [Generated Project Structure](#generated-project-structure)
- [Local Development](#local-development)
- [Testing](#testing)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

## Installation

### Global Installation (Recommended)

```bash
npm install -g ng-pro-scaffold
```

### Using npx

```bash
npx ng-pro-scaffold new my-project
```

## Usage

### Interactive Mode

Run the CLI without arguments to start interactive mode:

```bash
ng-pro-scaffold new
```

You will be prompted to:
1. Enter your project name
2. Choose whether to include Tailwind CSS
3. Choose whether to include Docker configuration
4. Choose whether to include Angular Material
5. Select your preferred package manager (npm, yarn, or pnpm)

### Non-Interactive Mode (CI/CD)

Perfect for automation and CI/CD pipelines:

```bash
ng-pro-scaffold new my-project --tailwind --docker --material --package-manager npm
```

## Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--tailwind` | `-t` | Include Tailwind CSS configuration | `false` |
| `--docker` | `-d` | Include Docker configuration (Dockerfile, docker-compose.yml) | `false` |
| `--material` | `-m` | Include Angular Material component library | `false` |
| `--package-manager <manager>` | `-p` | Package manager to use (npm, yarn, pnpm) | `npm` |
| `--help` | `-h` | Show help information | - |
| `--version` | `-v` | Show version number | - |

## Generated Project Structure

```
my-project/
├── src/
│   ├── app/
│   │   ├── home/
│   │   │   └── home.component.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── assets/
│   │   └── .gitkeep
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.spec.json
```

### With Docker Option

```
my-project/
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
└── .dockerignore
```

## Local Development

### Prerequisites

- Node.js >= 18.0.0
- npm, yarn, or pnpm
- Git

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ng-pro-scaffold.git
   cd ng-pro-scaffold
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Link for local development**

   ```bash
   npm link
   ```

4. **Test the CLI**

   ```bash
   ng-pro-scaffold new test-project
   ```

## Testing

Run the test suite:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Run the CLI |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- How to submit pull requests
- Coding standards
- Commit message guidelines
- Development setup

### Quick Links

- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Changelog](CHANGELOG.md)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## Roadmap

- [ ] Unit test configuration options (Jasmine/Jest)
- [ ] E2E testing setup options (Cypress/Playwright)
- [ ] ESLint/Prettier pre-configuration
- [ ] Git repository initialization
- [ ] GitHub Actions workflow generation
- [ ] Additional templates (admin dashboard, e-commerce)
- [ ] Custom component generation
- [ ] Internationalization (i18n) setup
- [ ] PWA support
- [ ] SSR/Prerendering setup

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Commander.js](https://github.com/tj/commander.js/)
- Interactive prompts by [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- Beautiful CLI output with [Chalk](https://github.com/chalk/chalk) and [Ora](https://github.com/sindresorhus/ora)

---

Made with ❤️ by the ng-pro-scaffold team