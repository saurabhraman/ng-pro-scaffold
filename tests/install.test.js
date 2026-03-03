import { describe, it, expect } from '@jest/globals';
import { sanitizeInput, getInstallCommand, detectPackageManagers } from '../src/utils/install.js';

describe('sanitizeInput', () => {
  it('should allow alphanumeric characters', () => {
    expect(sanitizeInput('npm')).toBe('npm');
    expect(sanitizeInput('yarn123')).toBe('yarn123');
  });

  it('should remove shell metacharacters', () => {
    expect(sanitizeInput('npm; rm -rf /')).toBe('npm rm -rf ');
    expect(sanitizeInput('$(malicious)')).toBe('malicious');
  });

  it('should handle non-string input', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
  });
});

describe('getInstallCommand', () => {
  it('should return correct command for npm', () => {
    const result = getInstallCommand('npm');
    expect(result.command).toBe('npm');
    expect(result.args).toContain('install');
  });

  it('should throw error for unsupported package manager', () => {
    expect(() => getInstallCommand('bower')).toThrow('Unsupported package manager');
  });
});

describe('detectPackageManagers', () => {
  it('should return an object with npm, yarn, pnpm properties', async () => {
    const result = await detectPackageManagers();
    expect(result).toHaveProperty('npm');
    expect(result).toHaveProperty('yarn');
    expect(result).toHaveProperty('pnpm');
  });
});