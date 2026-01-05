import { describe, it, expect, beforeEach } from '@jest/globals';
import { createAstGrepTools } from '../index';

describe('AstGrep Tools', () => {
  let tools: any;

  beforeEach(() => {
    tools = createAstGrepTools();
  });

  describe('ast_grep tool', () => {
    it('should have correct name and description', () => {
      expect(tools.ast_grep.name).toBe('ast_grep');
      expect(tools.ast_grep.description).toBeDefined();
    });

    it('should have required parameters', () => {
      expect(tools.ast_grep.parameters.required).toContain('pattern');
    });

    it('should have execute method', () => {
      expect(typeof tools.ast_grep.execute).toBe('function');
    });
  });

  describe('ast_grep_pattern tool', () => {
    it('should have correct name and description', () => {
      expect(tools.ast_grep_pattern.name).toBe('ast_grep_pattern');
      expect(tools.ast_grep_pattern.description).toBeDefined();
    });

    it('should create regex pattern', () => {
      const result = tools.ast_grep_pattern.createRegexPattern('useState');
      expect(result).toContain('useState');
      expect(result).toContain('Regex Pattern');
    });

    it('should create semantic pattern', () => {
      const result = tools.ast_grep_pattern.createSemanticPattern(
        'function',
        'typescript',
      );
      expect(result).toContain('function');
      expect(result).toContain('Semantic Pattern');
    });

    it('should create struct pattern', () => {
      const result = tools.ast_grep_pattern.createStructPattern(
        'class',
        'typescript',
      );
      expect(result).toContain('class');
      expect(result).toContain('Struct Pattern');
    });

    it('should execute with pattern_type parameter', async () => {
      const options = {
        pattern_type: 'regex' as const,
        target: 'useEffect',
      };

      const result = await tools.ast_grep_pattern.execute(options);
      expect(result).toBeDefined();
      expect(result).toContain('useEffect');
    });
  });
});
