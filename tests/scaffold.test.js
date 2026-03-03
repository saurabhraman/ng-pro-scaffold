import { describe, it, expect } from '@jest/globals';
import { replacePlaceholders, generateTemplateVariables } from '../src/utils/scaffold.js';

describe('replacePlaceholders', () => {
  it('should replace a single placeholder', () => {
    const content = 'Hello, {{name}}!';
    const variables = { name: 'World' };
    const result = replacePlaceholders(content, variables);
    expect(result).toBe('Hello, World!');
  });

  it('should replace multiple placeholders', () => {
    const content = '{{greeting}}, {{name}}!';
    const variables = { greeting: 'Hello', name: 'User' };
    const result = replacePlaceholders(content, variables);
    expect(result).toBe('Hello, User!');
  });

  it('should handle placeholders with whitespace', () => {
    const content = 'Project: {{ project-name }}';
    const variables = { 'project-name': 'my-app' };
    const result = replacePlaceholders(content, variables);
    expect(result).toBe('Project: my-app');
  });

  it('should replace all occurrences of the same placeholder', () => {
    const content = '{{name}} and {{name}}';
    const variables = { name: 'test' };
    const result = replacePlaceholders(content, variables);
    expect(result).toBe('test and test');
  });

  it('should handle numeric values', () => {
    const content = 'Port: {{port}}';
    const variables = { port: 4200 };
    const result = replacePlaceholders(content, variables);
    expect(result).toBe('Port: 4200');
  });
});

describe('generateTemplateVariables', () => {
  it('should generate variables from project name', () => {
    const answers = {
      projectName: 'my-app',
      includeTailwind: true,
      includeDocker: false,
      includeAngularMaterial: false,
      packageManager: 'npm'
    };
    
    const variables = generateTemplateVariables(answers);
    
    expect(variables['project-name']).toBe('my-app');
    expect(variables['projectName']).toBe('myApp');
    expect(variables['ProjectName']).toBe('MyApp');
  });
});