/**
 * Dependency Installation Module
 * 
 * This module handles:
 * - Detecting available package managers (npm, yarn, pnpm)
 * - Running install commands safely
 * - Handling installation errors gracefully
 * 
 * SECURITY: All inputs are sanitized before being passed to shell commands
 * to prevent command injection attacks.
 */

import { spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

/**
 * Sanitizes a string for safe use in shell commands.
 * Removes or escapes potentially dangerous characters.
 * 
 * This is a defense-in-depth measure - we prefer passing arguments
 * as separate parameters to spawn, but this provides additional protection.
 * 
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Only allow alphanumeric characters, hyphens, underscores, and dots
  // This is intentionally restrictive for package manager commands
  return input.replace(/[^a-zA-Z0-9._-]/g, '');
}

/**
 * Validates a project name for use in file paths.
 * 
 * @param {string} projectName - The project name to validate
 * @throws {Error} - If the name is invalid
 */
function validateProjectName(projectName) {
  if (!projectName || typeof projectName !== 'string') {
    throw new Error('Invalid project name');
  }
  
  // Check for path traversal attempts
  if (projectName.includes('..') || projectName.includes('/') || projectName.includes('\\')) {
    throw new Error('Project name contains invalid path characters');
  }
  
  // Check for allowed characters only
  const validPattern = /^[a-zA-Z0-9._-]+$/;
  if (!validPattern.test(projectName)) {
    throw new Error('Project name contains invalid characters');
  }
}

/**
 * Detects which package managers are available on the system.
 * 
 * @returns {Promise<Object>} - Object with boolean flags for each package manager
 */
async function detectPackageManagers() {
  const managers = {
    npm: false,
    yarn: false,
    pnpm: false,
  };
  
  /**
   * Checks if a command is available on the system.
   * Uses 'which' on Unix and 'where' on Windows.
   * 
   * @param {string} command - The command to check
   * @returns {Promise<boolean>}
   */
  const isCommandAvailable = (command) => {
    return new Promise((resolve) => {
      const checkCommand = process.platform === 'win32' ? 'where' : 'which';
      
      const child = spawn(checkCommand, [command], {
        shell: false,
        stdio: 'ignore',
      });
      
      child.on('close', (code) => {
        resolve(code === 0);
      });
      
      child.on('error', () => {
        resolve(false);
      });
    });
  };
  
  // Check all package managers in parallel
  const results = await Promise.all([
    isCommandAvailable('npm'),
    isCommandAvailable('yarn'),
    isCommandAvailable('pnpm'),
  ]);
  
  managers.npm = results[0];
  managers.yarn = results[1];
  managers.pnpm = results[2];
  
  return managers;
}

/**
 * Gets the install command for a specific package manager.
 * 
 * @param {string} packageManager - The package manager name
 * @returns {Object} - Object with command and args
 */
function getInstallCommand(packageManager) {
  const sanitized = sanitizeInput(packageManager);
  
  const commands = {
    npm: { command: 'npm', args: ['install'] },
    yarn: { command: 'yarn', args: ['install'] },
    pnpm: { command: 'pnpm', args: ['install'] },
  };
  
  const cmd = commands[sanitized];
  
  if (!cmd) {
    throw new Error(`Unsupported package manager: ${sanitized}`);
  }
  
  return cmd;
}

/**
 * Executes a command in a specific directory.
 * 
 * @param {string} command - The command to execute
 * @param {string[]} args - Command arguments
 * @param {string} cwd - Working directory
 * @param {Object} spinner - Ora spinner instance
 * @returns {Promise<void>}
 */
function executeCommand(command, args, cwd, spinner) {
  return new Promise((resolve, reject) => {
    // Validate the working directory
    const resolvedCwd = path.resolve(cwd);
    
    // Spawn the process
    const child = spawn(command, args, {
      cwd: resolvedCwd,
      shell: process.platform === 'win32', // Use shell on Windows for .cmd files
      stdio: 'inherit', // Pipe output to parent for real-time feedback
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      if (error.code === 'ENOENT') {
        reject(new Error(`Command '${command}' not found. Please ensure it is installed and in your PATH.`));
      } else {
        reject(error);
      }
    });
  });
}

/**
 * Displays the success message with next steps.
 * 
 * @param {Object} answers - User's configuration answers
 */
function displaySuccessMessage(answers) {
  const projectName = answers.projectName;
  const packageManager = answers.packageManager;
  
  // Determine the start command based on package manager
  const runCommand = packageManager === 'npm' 
    ? 'npm start' 
    : packageManager === 'yarn'
      ? 'yarn start'
      : 'pnpm start';
  
  console.log(chalk.green('\n🎉 Project created successfully!\n'));
  console.log(chalk.cyan('Next steps:\n'));
  console.log(chalk.white(`  cd ${projectName}`));
  console.log(chalk.white(`  ${runCommand}`));
  console.log('');
  console.log(chalk.gray('Happy coding! 🚀\n'));
}

/**
 * Main function to install dependencies in the newly created project.
 * 
 * @param {Object} answers - User's configuration answers
 * @returns {Promise<void>}
 */
export async function installDependencies(answers) {
  const projectName = answers.projectName;
  const preferredPackageManager = answers.packageManager;
  
  // Validate project name for security
  validateProjectName(projectName);
  
  const projectDir = path.resolve(process.cwd(), projectName);
  
  // Verify the project directory exists
  if (!(await fs.pathExists(projectDir))) {
    throw new Error(`Project directory '${projectDir}' not found`);
  }
  
  // Verify package.json exists
  const packageJsonPath = path.join(projectDir, 'package.json');
  if (!(await fs.pathExists(packageJsonPath))) {
    console.log(chalk.yellow('\n⚠️  No package.json found. Skipping dependency installation.\n'));
    displaySuccessMessage(answers);
    return;
  }
  
  // Start the installation spinner
  const spinner = ora({
    text: 'Installing dependencies...',
    spinner: 'dots',
  }).start();
  
  try {
    // Detect available package managers
    spinner.text = 'Detecting package managers...';
    const availableManagers = await detectPackageManagers();
    
    // Determine which package manager to use
    let packageManager = preferredPackageManager;
    
    if (!availableManagers[packageManager]) {
      spinner.text = `${preferredPackageManager} not found, checking alternatives...`;
      
      // Fall back to available package managers
      if (availableManagers.npm) {
        packageManager = 'npm';
      } else if (availableManagers.yarn) {
        packageManager = 'yarn';
      } else if (availableManagers.pnpm) {
        packageManager = 'pnpm';
      } else {
        spinner.fail(chalk.yellow('No package manager found'));
        console.log(chalk.yellow('\n⚠️  No package manager detected. Please install dependencies manually.\n'));
        displaySuccessMessage(answers);
        return;
      }
      
      console.log(chalk.gray(`\nUsing ${packageManager} instead of ${preferredPackageManager}`));
    }
    
    // Get the install command
    spinner.text = `Installing dependencies with ${packageManager}...`;
    const { command, args } = getInstallCommand(packageManager);
    
    // Execute the install command
    await executeCommand(command, args, projectDir, spinner);
    
    spinner.succeed(chalk.green('Dependencies installed successfully!'));
    
    // Display success message with next steps
    displaySuccessMessage(answers);
    
  } catch (error) {
    spinner.fail(chalk.red('Dependency installation failed'));
    
    // Provide helpful error message
    console.log(chalk.yellow('\n⚠️  Dependency installation failed. This might be due to:'));
    console.log(chalk.gray('   • No internet connection'));
    console.log(chalk.gray('   • npm registry is unavailable'));
    console.log(chalk.gray('   • Invalid package.json configuration'));
    console.log('');
    console.log(chalk.cyan('You can try installing dependencies manually:'));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white(`  ${preferredPackageManager} install`));
    console.log('');
    
    // Still show the project was created
    console.log(chalk.green('Your project structure has been created successfully.'));
    console.log(chalk.gray(`Project location: ${projectDir}\n`));
  }
}

// Export utility functions for testing
export { sanitizeInput, detectPackageManagers, getInstallCommand };