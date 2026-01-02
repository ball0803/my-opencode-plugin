# Documentation Style Guide

This guide provides style and formatting conventions for documentation in the My-OpenCode-Plugin project.

## General Guidelines

### Tone and Voice

- **Friendly and Approachable**: Write as if talking to a colleague
- **Clear and Concise**: Get to the point quickly
- **Helpful**: Assume the reader needs guidance
- **Professional**: Maintain a professional tone

### Structure

- **Start with "Why"**: Explain the purpose before the details
- **Progressive Disclosure**: Start simple, then add complexity
- **Consistent**: Use the same structure for similar topics
- **Scannable**: Use headings, bullet points, and tables

### Formatting

- **Headings**: Use consistent heading hierarchy
- **Code Blocks**: Use triple backticks for code
- **Inline Code**: Use single backticks for inline code
- **Links**: Use descriptive link text
- **Lists**: Use bullet points for lists
- **Tables**: Use tables for comparison or reference

## Markdown Style

### Headings

```markdown
# Level 1 (Page Title)
## Level 2 (Section)
### Level 3 (Subsection)
#### Level 4 (Sub-subsection)
##### Level 5 (Details)
###### Level 6 (Minor Details)
```

### Code Blocks

```typescript
// Good: Language specified
```typescript
const x = 5;
```

```bash
# Good: Language specified
```bash
npm install
```
```

### Inline Code

```markdown
Use `npm install` to install dependencies.
```

### Links

```markdown
[Installation Guide](installation.md)

[OpenCode Documentation](https://opencode.ai/docs)
```

### Lists

```markdown
# Good: Bullet points
- First item
- Second item
- Third item

# Good: Numbered list
1. First step
2. Second step
3. Third step
```

### Tables

```markdown
| Name | Type | Required | Description |
|------|------|----------|-------------|
| param1 | string | Yes | Description |
| param2 | number | No | Optional parameter |
```

## Documentation Types

### API Documentation

```markdown
## Method: methodName()

**Description:** What the method does

**Parameters:**
- `param1` (`type`): Description
- `param2` (`type`, optional): Description

**Returns:** `returnType`

**Throws:** `ErrorType` if condition

**Example:**
```typescript
// Usage example
```
```

### Tool Documentation

```markdown
## Tool: toolName

**Description:** What the tool does

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| param1 | type | yes/no | Description |

**Returns:** `ReturnType`

**Examples:**

```typescript
// Example 1: Basic usage
```

```typescript
// Example 2: Advanced usage
```

**Error Handling:**
- Error 1: Description and solution
- Error 2: Description and solution
```

### Configuration Documentation

```markdown
## Configuration Option: optionName

**Type:** `type`

**Default:** `defaultValue`

**Range:** `min` - `max`

**Description:** What the option does

**Example:**
```json
"optionName": value
```

**Impact:** What happens when changed
```

## Examples

### Good Example

```markdown
## Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Git

### Steps

1. Clone the repository
2. Install dependencies
3. Build the project
4. Run tests

### Verification

Check that all tests pass.
```

### Bad Example

```markdown
## Installation

You need Node.js and npm to install this. Clone the repo, then run npm install. Make sure tests pass.
```

## Best Practices

### Write for Your Audience

- **Users**: Explain how to use the plugin
- **Developers**: Explain how the code works
- **Contributors**: Explain how to contribute

### Keep Documentation Updated

- Update docs when adding new features
- Update docs when fixing bugs
- Update docs when refactoring
- Review docs in PR reviews

### Use Consistent Terminology

- Use the same terms for the same concepts
- Define terms when first used
- Avoid jargon without explanation

### Include Examples

- Show real-world usage
- Include both success and error cases
- Use actual code snippets
- Explain what each part does

### Link to Related Documentation

- Link to related topics
- Link to API documentation
- Link to examples
- Link to troubleshooting

## Documentation Review Checklist

- [ ] API documentation updated
- [ ] User guide examples updated
- [ ] Architecture diagrams updated (if applicable)
- [ ] Code comments added/updated
- [ ] Links between documentation maintained
- [ ] Spelling and grammar checked
- [ ] Formatting consistent
- [ ] Examples working and tested
- [ ] Clear and concise
- [ ] Helpful and approachable

## Tools

### Markdown Linter

Use a markdown linter to check formatting:

```bash
npm install -g markdownlint-cli
markdownlint **/*.md
```

### Spell Checker

Use a spell checker for documentation:

```bash
npm install -g cspell
cspell **/*.md
```

### Link Checker

Check for broken links:

```bash
npm install -g markdown-link-check
markdown-link-check **/*.md
```

## See Also

- [Contribution Guidelines](CONTRIBUTING.md) - How to contribute
- [Development Guidelines](development/guidelines.md) - Coding standards
- [AGENTS.md](../AGENTS.md) - Agent development guidelines
