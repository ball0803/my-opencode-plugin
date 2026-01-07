"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnyMcpNameSchema = exports.McpNameSchema = void 0;
var zod_1 = require("zod");
exports.McpNameSchema = zod_1.z.enum([
    'searxng',
    'context7',
    'grep_app',
    'gh_grep',
    'octocode',
    'puppeteer',
]);
exports.AnyMcpNameSchema = zod_1.z.string();
