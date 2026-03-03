# Contributing to ng-pro-scaffold

First off, thank you for considering contributing to ng-pro-scaffold! It's people like you that make ng-pro-scaffold such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm, yarn, or pnpm
- Git

### Development Setup

1. **Fork the repository**

   Click the "Fork" button at the top right of the repository page.

2. **Clone your fork**

   ```bash
   git clone https://github.com/your-username/ng-pro-scaffold.git
   cd ng-pro-scaffold
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Link the package for local development**

   ```bash
   npm link
   ```

5. **Verify the setup**

   ```bash
   ng-pro-scaffold --version
   ng-pro-scaffold --help
   ```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and the behavior you expected**
- **Include screenshots or animated GIFs if helpful**
- **Include your environment details** (OS, Node.js version, package manager)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain the behavior you expected**
- **Explain why this enhancement would be useful**

### Pull Requests

1. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**

   - Follow the [coding standards](#coding-standards)
   - Add/update tests as needed
   - Update documentation if necessary

3. **Run tests**

   ```bash
   npm test
   npm run lint
   ```

4. **Commit your changes**

   Follow the [commit message guidelines](#commit-message-guidelines).

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

   - Provide a clear description of the changes
   - Reference any related issues
   - Ensure all CI checks pass

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations, and container parameters.
3. Update the CHANGELOG.md with details of your changes under the `[Unreleased]` section.
4. The PR will be merged once you have the sign-off of at least one maintainer.

## Coding Standards

### JavaScript/TypeScript

- Use ES6+ features where appropriate
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for public functions
- Follow ESLint rules configured in `.eslintrc.json`

### Code Formatting

We use Prettier for code formatting. Run the formatter before committing:

```bash
npm run format
```

### Linting

We use ESLint for code quality. Fix linting issues before committing:

```bash
npm run lint
npm run lint:fix
```

### Testing

- Write unit tests for new functionality
- Maintain or improve code coverage
- Run tests before submitting PRs

```bash
npm test
npm run test:coverage
```

## Commit Message Guidelines

We follow conventional commits specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```
feat(tailwind): add dark mode support

fix(scaffold): correct file path generation on Windows

docs(readme): update installation instructions

test(install): add tests for package manager detection
```

## Project Structure

```
ng-pro-scaffold/
├── bin/
│   └── cli.js           # CLI entry point
├── src/
│   ├── index.js         # Main module exports
│   └── utils/
│       ├── install.js   # Package installation utilities
│       └── scaffold.js  # Scaffolding logic
├── templates/
│   └── base/            # Base Angular template
├── tests/               # Test files
└── package.json
```

## Getting Help

- Open an issue for questions
- Check existing issues and discussions
- Review the README.md for documentation

## Recognition

Contributors will be recognized in our README.md. Thank you for your contributions!

---

Happy coding! 🚀