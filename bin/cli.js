#!/usr/bin/env node

/**
 * ng-pro-scaffold CLI Entry Point
 * 
 * This is the main entry point for the CLI tool. It uses commander.js
 * to parse command-line arguments and route to the appropriate handlers.
 * 
 * The shebang (#!/usr/bin/env node) is essential for making this script
 * executable as a CLI command when installed globally or via npm link.
 */

import { program } from '../src/index.js';

// Initialize the CLI program
program.parse(process.argv);