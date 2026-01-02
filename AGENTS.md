# AGENTS.md - Documentation Guidelines for My-OpenCode-Plugin

This file provides comprehensive guidelines for updating and writing documentation in the My-OpenCode-Plugin project. It is specifically designed for agentic coding agents working on this repository.

## Documentation Overview

The project follows a structured documentation approach with the following key principles:

1. **Modular Structure**: Documentation is organized by category and audience
2. **Consistent Style**: All documentation follows the same formatting and style guidelines  
3. **Comprehensive Coverage**: Every feature, API, and component is documented
4. **Example-Driven**: Documentation includes practical examples
5. **Versioned**: Documentation is kept in sync with code changes

## Documentation Structure

```
docs/
├── README.md                  # Overview and quick start
├── architecture/              # Architecture documentation
├── user-guide/                # User-facing documentation
├── development/              # Developer documentation
├── api-reference/            # API documentation
├── examples/                  # Usage examples
├── CONTRIBUTING.md           # Contribution guidelines
└── STYLE-GUIDE.md            # Documentation style guide
```

## How to Update Documentation

### 1. Identify What Needs Documentation

When making changes to the codebase, ask:
- Does this affect any existing documentation?
- Does this require new documentation?
- Should examples be updated?
- Should API reference be updated?

### 2. Locate the Appropriate Documentation File

| Change Type | Documentation Location |
|-------------|-----------------------|
| New feature | user-guide/, api-reference/, examples/ |
| Bug fix | FAQ, Troubleshooting sections |
| API change | api-reference/ |
| Architecture change | architecture/ |
| Configuration change | user-guide/configuration.md |
| Tool addition | user-guide/tools.md, api-reference/ |

### 3. Update Existing Documentation

When updating existing documentation:

1. **Find the relevant section** in the appropriate file
2. **Update the content** to reflect the changes
3. **Verify examples** still work correctly
4. **Check cross-references** to ensure links are still valid
5. **Review related documentation** for consistency

### 4. Add New Documentation

When adding new documentation:

1. **Choose the right location** based on the documentation type
2. **Follow the existing structure** and style
3. **Include all necessary sections** (description, usage, examples, etc.)
4. **Add cross-references** to related documentation
5. **Link from appropriate places** (README, navigation, etc.)

## Documentation Writing Guidelines

### General Principles

1. **Be Clear and Concise**: Get to the point quickly
2. **Write for Your Audience**: 
   - Users need practical guidance
   - Developers need technical details
   - Contributors need contribution information
3. **Use Consistent Terminology**: Define terms when first used
4. **Include Examples**: Show real-world usage
5. **Progressive Disclosure**: Start simple, then add complexity

### Markdown Formatting

#### Headings

```markdown
# Level 1 (Page Title)
## Level 2 (Section)
### Level 3 (Subsection)
#### Level 4 (Sub-subsection)
```

#### Code Blocks

```typescript
// Good: Language specified
```typescript
const x = 5;
```

```bash
// Good: Language specified
```bash
npm install
```

#### Inline Code

```markdown
Use `npm install` to install dependencies.
```

#### Links

```markdown
[Installation Guide](installation.md)

[OpenCode Documentation](https://opencode.ai/docs)
```

#### Lists

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

#### Tables

```markdown
| Name | Type | Required | Description |
|------|------|----------|-------------|
| param1 | string | Yes | Description |
| param2 | number | No | Optional parameter |
```

### Documentation Types

#### API Documentation

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

#### Tool Documentation

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

#### Configuration Documentation

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

### Documentation Sections

Every documentation file should include appropriate sections based on its purpose:

#### For User Guides

1. **Overview**: High-level description
2. **Prerequisites**: Requirements for using the feature
3. **Steps**: Step-by-step instructions
4. **Examples**: Practical usage examples
5. **Troubleshooting**: Common issues and solutions
6. **See Also**: Related documentation

#### For API Reference

1. **Description**: What the API does
2. **Parameters**: Input parameters
3. **Returns**: Return values
4. **Throws**: Error conditions
5. **Examples**: Usage examples
6. **See Also**: Related APIs

#### For Architecture Documentation

1. **Overview**: High-level architecture
2. **Components**: Component breakdown
3. **Data Flow**: How data moves through the system
4. **Design Decisions**: Key architectural decisions
5. **Diagrams**: Visual representations

## Documentation Workflow

### 1. Before Making Changes

1. **Read existing documentation** to understand the current state
2. **Identify what needs to be updated** based on your changes
3. **Plan your documentation updates** alongside code changes

### 2. While Making Changes

1. **Update documentation incrementally** as you make code changes
2. **Keep documentation and code in sync**
3. **Test examples** to ensure they work correctly

### 3. After Making Changes

1. **Review all documentation** for consistency
2. **Check cross-references** to ensure links are valid
3. **Verify examples** work correctly
4. **Update TODO.md** if documentation tasks are completed

## Documentation Review Checklist

Before submitting changes, review documentation against this checklist:

- [ ] Documentation is clear and concise
- [ ] Examples are working and tested
- [ ] Links to related documentation are valid
- [ ] Terminology is consistent with other documentation
- [ ] Code formatting is correct
- [ ] Markdown formatting is consistent
- [ ] Spelling and grammar are correct
- [ ] Documentation follows the style guide
- [ ] All new features are documented
- [ ] All API changes are documented
- [ ] All configuration changes are documented

## Documentation Tools

### Markdown Linter

Check formatting:

```bash
npm install -g markdownlint-cli
markdownlint **/*.md
```

### Spell Checker

Check spelling:

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

## Documentation Best Practices

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

### Write for Your Audience

- **Users**: Explain how to use the plugin
- **Developers**: Explain how the code works
- **Contributors**: Explain how to contribute

## Documentation Examples

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

## Documentation Maintenance

### When to Update Documentation

1. **Adding New Features**: Add new documentation sections
2. **Fixing Bugs**: Update examples and troubleshooting
3. **Refactoring**: Update architecture and API docs
4. **Breaking Changes**: Update migration guides
5. **Deprecations**: Mark deprecated features and provide alternatives

### How to Update Documentation

1. **Find the relevant documentation** file
2. **Update the content** to reflect changes
3. **Verify examples** still work
4. **Check cross-references** for validity
5. **Review related documentation** for consistency

### Documentation Review Process

1. **Self-Review**: Review your own documentation
2. **Peer Review**: Have another team member review
3. **Testing**: Verify all examples work
4. **Consistency Check**: Ensure consistency with other docs

## Documentation Standards

### Markdown Standards

- Use consistent heading hierarchy
- Use triple backticks for code blocks
- Use single backticks for inline code
- Use descriptive link text
- Use bullet points for lists
- Use tables for comparison or reference

### Content Standards

- Be clear and concise
- Write for your audience
- Use consistent terminology
- Include examples
- Link to related documentation
- Keep documentation updated

### Style Standards

- Use friendly and approachable tone
- Be helpful and professional
- Start with "Why" before details
- Use progressive disclosure
- Make documentation scannable

## Documentation Resources

- [Documentation Style Guide](docs/STYLE-GUIDE.md)
- [Contribution Guidelines](docs/CONTRIBUTING.md)
- [Development Guidelines](docs/development/guidelines.md)
- [AGENTS.md](AGENTS.md) - This file

## Documentation FAQ

### Q: When should I update documentation?

A: Update documentation whenever you make changes to the codebase that affect:
- Features
- APIs
- Configuration
- Architecture
- Behavior

### Q: How do I know what documentation to update?

A: Look at the type of change you're making:
- New features → user guide, API reference, examples
- Bug fixes → FAQ, troubleshooting
- API changes → API reference
- Architecture changes → architecture docs
- Configuration changes → configuration guide

### Q: How do I write good documentation?

A: Follow these principles:
1. Be clear and concise
2. Write for your audience
3. Include examples
4. Use consistent terminology
5. Link to related documentation

### Q: How do I review documentation?

A: Use the documentation review checklist:
- Is it clear and concise?
- Are examples working?
- Are links valid?
- Is terminology consistent?
- Is formatting correct?
- Is it following the style guide?

### Q: How do I keep documentation in sync with code?

A: Update documentation as you make code changes:
1. Update docs when adding features
2. Update docs when fixing bugs
3. Update docs when refactoring
4. Review docs in PR reviews
