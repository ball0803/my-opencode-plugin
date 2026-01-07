import { z } from 'zod';

export const McpNameSchema = z.enum([
  'searxng',
  'context7',
  'grep_app',
  'gh_grep',
  'octocode',
  'puppeteer',
]);
export const AnyMcpNameSchema = z.string();

export type McpName = z.infer<typeof McpNameSchema>;
export type AnyMcpName = z.infer<typeof AnyMcpNameSchema>;
