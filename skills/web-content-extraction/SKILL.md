---
name: web-content-extraction
description: Extract content from websites, automate browser interactions, and inspect rendered pages
license: MIT
compatibility: opencode>=1.0
metadata:
  audience: developers
  workflow: research
---

## What I do

- Navigate to web pages using Puppeteer
- Extract content using CSS selectors or JavaScript
- Take screenshots of pages or elements
- Automate form filling and submissions
- Handle dynamic content and waiting
- Fall back to simple URL reading when appropriate

## When to use me

Use this skill when you need:
- To scrape content from websites
- To extract rendered content (JavaScript-heavy sites)
- To take screenshots of web pages or UI elements
- To automate browser interactions
- To inspect UI elements and their properties
- To test how content renders in different browsers

Ask clarifying questions if:
- The website has complex navigation
- You need specific content that might be behind authentication
- The content is dynamically loaded
- You need to handle cookies or sessions

## How I work

### Step 1: Navigate to Target URL

```bash
mcp(mcp_name="puppeteer", tool_name="puppeteer_navigate", arguments='{"url": "https://example.com"}')
```

### Step 2: Extract Content

Using CSS selectors:

```bash
mcp(mcp_name="puppeteer", tool_name="puppeteer_evaluate", arguments='{"script": "document.querySelector('.content').innerText"}')
```

Or using JavaScript:

```bash
mcp(mcp_name="puppeteer", tool_name="puppeteer_evaluate", arguments='{"script": "Array.from(document.querySelectorAll('article')).map(el => el.textContent)"}')
```

### Step 3: Take Screenshots (Optional)

```bash
# Full page screenshot
mcp(mcp_name="puppeteer", tool_name="puppeteer_screenshot", arguments='{"name": "page_screenshot", "selector": "body"}')

# Element-specific screenshot
mcp(mcp_name="puppeteer", tool_name="puppeteer_screenshot", arguments='{"name": "content_screenshot", "selector": ".main-content"}')
```

### Step 4: Automate Interactions

```bash
# Fill form
mcp(mcp_name="puppeteer", tool_name="puppeteer_fill", arguments='{"selector": "input[name=email]", "value": "test@example.com"}')

# Click button
mcp(mcp_name="puppeteer", tool_name="puppeteer_click", arguments='{"selector": "button[type=submit]"}')

# Select dropdown
mcp(mcp_name="puppeteer", tool_name="puppeteer_select", arguments='{"selector": "select[name=country]", "value": "US"}')
```

### Step 5: Handle Dynamic Content

```bash
# Wait for element
mcp(mcp_name="puppeteer", tool_name="puppeteer_evaluate", arguments='{"script": "await document.querySelector('.dynamic-content').waitForSelector('.loaded', { timeout: 5000 })"}')

# Scroll to element
mcp(mcp_name="puppeteer", tool_name="puppeteer_evaluate", arguments='{"script": "document.querySelector('.element').scrollIntoView()"}')
```

### Step 6: Fallback to Simple Reading

For static content:

```bash
mcp(mcp_name="searxng", tool_name="web_url_read", arguments='{"url": "https://example.com"}')
```

## Best Practices

1. **Respect robots.txt** - Check website scraping policies before extracting content
2. **Implement rate limiting** - Don't overwhelm servers with rapid requests
3. **Use specific selectors** - Target elements precisely to avoid scraping unwanted content
4. **Handle errors gracefully** - Implement retry logic for failed requests
5. **Cache results** - Store extracted content to avoid repeated scraping
6. **Use headless mode** - Run without UI for better performance
7. **Clean up** - Close browser instances when done
8. **Identify your scraper** - Use proper user-agent headers
9. **Handle dynamic content** - Use waiting strategies for JavaScript-rendered content
10. **Respect copyright** - Don't scrape and republish content without permission

## Common Patterns

### Content Extraction

```bash
# Extract article content
mcp(mcp_name="puppeteer", tool_name="puppeteer_navigate", arguments='{"url": "https://blog.example.com/article"}')
mcp(mcp_name="puppeteer", tool_name="puppeteer_evaluate", arguments='{"script": "document.querySelector('article').innerHTML"}')
```

### Form Automation

```bash
# Fill and submit search form
mcp(mcp_name="puppeteer", tool_name="puppeteer_navigate", arguments='{"url": "https://example.com/search"}')
mcp(mcp_name="puppeteer", tool_name="puppeteer_fill", arguments='{"selector": "input[name=q]", "value": "puppeteer tutorial"}')
mcp(mcp_name="puppeteer", tool_name="puppeteer_click", arguments='{"selector": "button[type=submit]"}')
```

### Screenshot Capture

```bash
# Take full page screenshot
mcp(mcp_name="puppeteer", tool_name="puppeteer_navigate", arguments='{"url": "https://example.com"}')
mcp(mcp_name="puppeteer", tool_name="puppeteer_screenshot", arguments='{"name": "example_page", "selector": "body", "width": 1200, "height": 800}')
```

### Dynamic Content Handling

```bash
# Wait for dynamic content to load
mcp(mcp_name="puppeteer", tool_name="puppeteer_navigate", arguments='{"url": "https://example.com/dynamic"}')
mcp(mcp_name="puppeteer", tool_name="puppeteer_evaluate", arguments='{"script": "await document.querySelector('.content').waitFor({ timeout: 10000 })"}')
mcp(mcp_name="puppeteer", tool_name="puppeteer_evaluate", arguments='{"script": "document.querySelector('.content').innerText"}')
```

## Limitations

- **JavaScript-heavy sites** - Some sites may have complex anti-scraping measures
- **Authentication** - Cannot handle sites requiring login (unless credentials provided)
- **Rate limiting** - Some sites may block scrapers
- **Dynamic content** - Content loaded via complex JavaScript may be difficult to extract
- **Legal restrictions** - Some websites prohibit scraping in their terms of service
- **Privacy concerns** - Be mindful of GDPR and other privacy regulations
- **Browser limitations** - Puppeteer may not handle all browser features perfectly

## Related Skills

- **general-research**: For finding information through web search
- **official-docs**: For official documentation (often better than scraping)
- **implementation-examples**: For code examples from GitHub
