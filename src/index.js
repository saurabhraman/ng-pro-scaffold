/**
 * ng-pro-scaffold - Main Module
 * 
 * This module defines the CLI commands and orchestrates the scaffolding process.
 * It uses commander.js for CLI parsing and inquirer for interactive prompts.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { scaffoldProject } from './utils/scaffold.js';
import { installDependencies } from './utils/install.js';

// Create a new Commander program instance
const program = new Command();

/**
 * Validates a project name to ensure it's a valid directory name
 * across all platforms (Windows, Mac, Linux).
 * 
 * Rules:
 * - Must start with a letter or underscore
 * - Can contain letters, numbers, underscores, and hyphens
 * - Cannot be a reserved name (CON, PRN, AUX, etc. on Windows)
 * - Must be between 1-214 characters
 * 
 * @param {string} input - The project name to validate
 * @returns {boolean|string} - True if valid, error message if invalid
 */
function validateProjectName(input) {
  if (!input || input.trim().length === 0) {
    return 'Project name is required';
  }

  const trimmed = input.trim();

  if (trimmed.length > 214) {
    return 'Project name must be 214 characters or less';
  }

  // Check for valid characters: letters, numbers, hyphens, underscores
  // Must start with a letter or underscore
  const validNamePattern = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;
  
  if (!validNamePattern.test(trimmed)) {
    return 'Project name must start with a letter or underscore and contain only letters, numbers, hyphens, or underscores';
  }

  // Windows reserved names that would cause issues
  const windowsReserved = [
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
  ];

  if (windowsReserved.includes(trimmed.toUpperCase())) {
    return `'${trimmed}' is a reserved name on Windows. Please choose another name.`;
  }

  return true;
}

/**
 * Prompts the user for project configuration options using inquirer.
 * 
 * @returns {Promise<Object>} - The user's answers
 */
async function promptUser() {
  console.log(chalk.cyan('\n🚀 Welcome to ng-pro-scaffold!\n'));
  console.log(chalk.gray('Let\'s set up your new Angular project with best practices.\n'));

  const questions = [
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?',
      validate: validateProjectName,
      filter: (input) => input.trim(),
    },
    {
      type: 'confirm',
      name: 'includeTailwind',
      message: 'Include Tailwind CSS for styling?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'includeDocker',
      message: 'Include Docker configuration?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'includeAngularMaterial',
      message: 'Include Angular Material?',
      default: false,
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Which package manager do you prefer?',
      choices: ['npm', 'yarn', 'pnpm'],
      default: 'npm',
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers;
}

/**
 * Displays a summary of the user's choices before proceeding.
 * 
 * @param {Object} answers - The user's configuration choices
 */
function displaySummary(answers) {
  console.log(chalk.cyan('\n📋 Project Configuration Summary:'));
  console.log(chalk.gray('─'.repeat(40)));
  console.log(`${chalk.white('Project Name:')} ${chalk.green(answers.projectName)}`);
  console.log(`${chalk.white('Tailwind CSS:')} ${answers.includeTailwind ? chalk.green('✓ Yes') : chalk.red('✗ No')}`);
  console.log(`${chalk.white('Docker:')} ${answers.includeDocker ? chalk.green('✓ Yes') : chalk.red('✗ No')}`);
  console.log(`${chalk.white('Angular Material:')} ${answers.includeAngularMaterial ? chalk.green('✓ Yes') : chalk.red('✗ No')}`);
  console.log(`${chalk.white('Package Manager:')} ${chalk.green(answers.packageManager)}`);
  console.log(chalk.gray('─'.repeat(40)));
}

// Configure the CLI program
program
  .name('ng-pro-scaffold')
  .description('An opinionated Angular project scaffolding CLI with modern best practices')
  .version('1.0.0');

// Define the 'new' command for creating a new project
program
  .command('new [project-name]')
  .description('Create a new Angular project')
  .option('-t, --tailwind', 'Include Tailwind CSS')
  .option('-d, --docker', 'Include Docker configuration')
  .option('-m, --material', 'Include Angular Material')
  .option('-p, --package-manager <manager>', 'Package manager (npm, yarn, pnpm)')
  .action(async (projectName, options) => {
    try {
      let answers;

      // If project name is provided via CLI argument, validate it
      if (projectName) {
        const validation = validateProjectName(projectName);
        if (validation !== true) {
          console.error(chalk.red(`\n❌ Error: ${validation}\n`));
          process.exit(1);
        }
      }

      // If all options are provided via CLI flags, skip interactive prompts
      // This enables CI/CD usage with non-interactive mode
      const isNonInteractive = projectName && 
        options.tailwind !== undefined && 
        options.docker !== undefined && 
        options.material !== undefined &&
        options.packageManager;

      if (isNonInteractive) {
        answers = {
          projectName: projectName.trim(),
          includeTailwind: options.tailwind,
          includeDocker: options.docker,
          includeAngularMaterial: options.material,
          packageManager: options.packageManager,
        };
        console.log(chalk.cyan('\n🚀 Creating Angular project in non-interactive mode...\n'));
      } else {
        // Interactive mode - prompt user for missing information
        answers = await promptUser();
        
        // Override with CLI arguments if provided
        if (projectName) {
          answers.projectName = projectName.trim();
        }
        if (options.tailwind !== undefined) {
          answers.includeTailwind = options.tailwind;
        }
        if (options.docker !== undefined) {
          answers.includeDocker = options.docker;
        }
        if (options.material !== undefined) {
          answers.includeAngularMaterial = options.material;
        }
        if (options.packageManager) {
          answers.packageManager = options.packageManager;
        }
      }

      // Display summary of choices
      displaySummary(answers);

      // Scaffold the project
      await scaffoldProject(answers);

      // Install dependencies
      await installDependencies(answers);

    } catch (error) {
      console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

// Export the program for use in cli.js
export { program };