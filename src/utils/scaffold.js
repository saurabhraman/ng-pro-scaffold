/**
 * Scaffold Utility Module
 * 
 * This module handles the core scaffolding logic:
 * - Copying template files to the target directory
 * - Processing template placeholders
 * - Setting correct file permissions
 * 
 * Using fs-extra for enhanced file system operations with promise support.
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Replaces placeholders in content with actual values.
 * 
 * Placeholder format: {{placeholder-name}}
 * 
 * @param {string} content - The content to process
 * @param {Object} variables - Key-value pairs for replacement
 * @returns {string} - The processed content
 */
function replacePlaceholders(content, variables) {
  let processed = content;
  
  for (const [key, value] of Object.entries(variables)) {
    // Create a regex that matches {{key}} pattern
    // The 'g' flag replaces all occurrences
    const placeholderRegex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    processed = processed.replace(placeholderRegex, String(value));
  }
  
  return processed;
}

/**
 * Determines if a file should be processed for placeholders.
 * Binary files and certain extensions should be skipped.
 * 
 * @param {string} filePath - Path to the file
 * @returns {boolean} - True if the file should be processed
 */
function shouldProcessFile(filePath) {
  // Binary file extensions to skip
  const binaryExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg',
    '.woff', '.woff2', '.ttf', '.eot', '.otf',
    '.zip', '.tar', '.gz',
    '.pdf', '.doc', '.docx',
  ];
  
  const ext = path.extname(filePath).toLowerCase();
  return !binaryExtensions.includes(ext);
}

/**
 * Processes a single file by copying it and replacing placeholders.
 * 
 * @param {string} srcPath - Source file path
 * @param {string} destPath - Destination file path
 * @param {Object} variables - Placeholder variables
 * @returns {Promise<void>}
 */
async function processFile(srcPath, destPath, variables) {
  // Ensure the destination directory exists
  await fs.ensureDir(path.dirname(destPath));
  
  if (shouldProcessFile(srcPath)) {
    // Read file content
    const content = await fs.readFile(srcPath, 'utf8');
    
    // Replace placeholders
    const processed = replacePlaceholders(content, variables);
    
    // Write to destination
    await fs.writeFile(destPath, processed, 'utf8');
  } else {
    // Binary file - copy directly without processing
    await fs.copy(srcPath, destPath);
  }
}

/**
 * Generates template variables from user answers.
 * This creates a consistent set of variables for template processing.
 * 
 * @param {Object} answers - User's configuration answers
 * @returns {Object} - Template variables
 */
function generateTemplateVariables(answers) {
  const projectName = answers.projectName;
  
  // Convert project name to various formats commonly needed
  const camelCase = projectName
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (char) => char.toLowerCase());
  
  const pascalCase = projectName
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (char) => char.toUpperCase());
  
  const kebabCase = projectName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();

  return {
    'project-name': projectName,
    'projectName': camelCase,
    'ProjectName': pascalCase,
    'project-name-kebab': kebabCase,
    'includeTailwind': answers.includeTailwind,
    'includeDocker': answers.includeDocker,
    'includeAngularMaterial': answers.includeAngularMaterial,
    'packageManager': answers.packageManager,
  };
}

/**
 * Recursively copies a directory with template processing.
 * 
 * @param {string} srcDir - Source directory
 * @param {string} destDir - Destination directory
 * @param {Object} variables - Template variables
 * @param {Object} spinner - Ora spinner instance for progress
 * @returns {Promise<void>}
 */
async function copyDirectory(srcDir, destDir, variables, spinner) {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    
    // Process directory/file names for placeholders too
    // This allows naming files like "{{project-name}}.component.ts"
    const processedName = replacePlaceholders(entry.name, variables);
    const destPath = path.join(destDir, processedName);
    
    if (entry.isDirectory()) {
      // Skip certain directories that might be conditional
      const dirName = entry.name.toLowerCase();
      
      // Check if this is a conditional directory based on features
      if (dirName === 'tailwind' && !variables.includeTailwind) {
        continue;
      }
      if (dirName === 'docker' && !variables.includeDocker) {
        continue;
      }
      if (dirName === 'material' && !variables.includeAngularMaterial) {
        continue;
      }
      
      // Recursively copy subdirectories
      await copyDirectory(srcPath, destPath, variables, spinner);
    } else {
      // Process individual files
      spinner.text = `Processing: ${processedName}`;
      await processFile(srcPath, destPath, variables);
    }
  }
}

/**
 * Validates that the target directory can be created.
 * 
 * @param {string} targetDir - The target directory path
 * @throws {Error} - If the directory cannot be created
 */
async function validateTargetDirectory(targetDir) {
  // Check if directory already exists
  if (await fs.pathExists(targetDir)) {
    const stats = await fs.stat(targetDir);
    
    if (stats.isDirectory()) {
      const files = await fs.readdir(targetDir);
      if (files.length > 0) {
        throw new Error(
          `Directory '${targetDir}' already exists and is not empty. ` +
          `Please choose a different name or remove the existing directory.`
        );
      }
    } else {
      throw new Error(
        `A file named '${targetDir}' already exists. ` +
        `Please choose a different project name.`
      );
    }
  }
  
  // Check parent directory permissions
  const parentDir = path.dirname(targetDir);
  try {
    await fs.access(parentDir, fs.constants.W_OK);
  } catch {
    throw new Error(
      `Cannot write to directory '${parentDir}'. ` +
      `Please ensure you have the necessary permissions.`
    );
  }
}

/**
 * Sets appropriate file permissions for the created project.
 * 
 * On Unix-like systems, we ensure directories are 755 (rwxr-xr-x)
 * and files are 644 (rw-r--r--).
 * 
 * On Windows, file permissions work differently, so we just ensure
 * files are readable and writable.
 * 
 * @param {string} targetDir - The project directory
 * @returns {Promise<void>}
 */
async function setFilePermissions(targetDir) {
  // Windows has different permission model, skip chmod operations
  if (process.platform === 'win32') {
    return;
  }
  
  // On Unix-like systems, set standard permissions
  const mode = {
    directory: 0o755, // rwxr-xr-x
    file: 0o644,      // rw-r--r--
  };
  
  async function setPermissions(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await fs.chmod(fullPath, mode.directory);
        await setPermissions(fullPath);
      } else {
        await fs.chmod(fullPath, mode.file);
      }
    }
  }
  
  await setPermissions(targetDir);
}

/**
 * Main scaffolding function that orchestrates the project creation.
 * 
 * @param {Object} answers - User's configuration answers
 * @returns {Promise<void>}
 */
export async function scaffoldProject(answers) {
  const targetDir = path.resolve(process.cwd(), answers.projectName);
  const templateDir = path.resolve(__dirname, '../../templates/base');
  
  // Validate target directory before proceeding
  await validateTargetDirectory(targetDir);
  
  // Create spinner for visual feedback
  const spinner = ora({
    text: 'Creating project structure...',
    spinner: 'dots',
  }).start();
  
  try {
    // Generate template variables
    const variables = generateTemplateVariables(answers);
    
    // Check if template directory exists
    if (!(await fs.pathExists(templateDir))) {
      spinner.fail(chalk.red('Template directory not found'));
      throw new Error(
        `Template directory not found at '${templateDir}'. ` +
        `Please ensure the templates are properly installed.`
      );
    }
    
    // Create the target directory
    await fs.ensureDir(targetDir);
    
    // Copy and process template files
    spinner.text = 'Copying template files...';
    await copyDirectory(templateDir, targetDir, variables, spinner);
    
    // Set file permissions
    spinner.text = 'Setting file permissions...';
    await setFilePermissions(targetDir);
    
    spinner.succeed(chalk.green('Project structure created successfully!'));
    
    console.log(chalk.gray(`\n📁 Project created at: ${targetDir}\n`));
    
  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    
    // Clean up partially created directory
    if (await fs.pathExists(targetDir)) {
      await fs.remove(targetDir);
    }
    
    throw error;
  }
}

// Export utility functions for testing
export { replacePlaceholders, generateTemplateVariables };