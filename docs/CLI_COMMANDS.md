# ClosedLoop AI CLI Commands Reference

Complete reference for all CLI commands, parameters, and user experience.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [How to Use API Keys](#how-to-use-api-keys)
- [Input Commands](#input-commands)
- [Feedback Commands](#feedback-commands)
- [Team Commands](#team-commands)
- [General Commands](#general-commands)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Installation

### Global Installation (Recommended)
```bash
npm install -g @closedloop-ai/cli
```

### Local Installation
```bash
npm install @closedloop-ai/cli
npx cl --help
```

### Verify Installation
```bash
cl --version
# Output: 0.2.0
```

## Configuration

### Set API Key
```bash
cl config set --api-key your-api-key-here
```

### View Configuration
```bash
cl config
# Output:
# ⚙️  Configuration:
# ────────────────────────────────────────
# API Key: ✓ Configured
# Config File: /Users/jirikobelka/.closedloop/config.json
```

### JSON Configuration
```bash
cl config --json
# Output: 
# {
#   "success": true,
#   "data": {
#     "apiKey": "test-key...",
#     "configFile": "/Users/jirikobelka/.closedloop/config.json",
#     "configured": true
#   }
# }
```

### Environment Variable
```bash
export CLOSEDLOOP_API_KEY="your-api-key-here"
cl config  # Will use environment variable
```

## Ingest Commands

### Ingest Customer Product Feedback

#### Basic Ingestion
```bash
cl ingest "Your customer product feedback here"
```

#### With Metadata
```bash
cl ingest "The dashboard is confusing and hard to navigate" \
  --title "Dashboard UX Issues" \
  --customer "customer-123" \
  --name "John Doe" \
  --email "john@example.com" \
  --url "https://support.example.com/ticket/456"
```

#### Wait for Processing
```bash
cl ingest "Customer complaint about performance" --wait
# Shows real-time processing status
```

#### JSON Output
```bash
cl ingest "Great product, love the new features!" --json
# Output: {"id":"74e3dd87-878f-41cf-8e5a-87527bbf7770","status":"submitted"}
```

### List Ingested Feedback

#### Basic List
```bash
cl ingest
# Shows table of recent ingests
```

#### With Pagination
```bash
cl ingest --page 2 --limit 10
# Shows page 2 with 10 items per page
```

#### JSON Output
```bash
cl ingest --json
# Output: {"data":[...],"pagination":{...}}
```

### View Specific Ingest

#### By ID
```bash
cl ingest 74e3dd87-878f-41cf-8e5a-87527bbf7770
# Shows detailed ingest information
```

#### JSON Output
```bash
cl ingest 74e3dd87-878f-41cf-8e5a-87527bbf7770 --json
# Output: {"id":"...","content":"...","status":"..."}
```

### Ingest Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `content` | string | Yes | Customer product feedback content | `"The app crashes when uploading files"` |
| `--title` | string | No | Title for the feedback | `"File Upload Issue"` |
| `--customer` | string | No | Customer identifier | `"customer-123"` |
| `--name` | string | No | Reporter name | `"John Doe"` |
| `--email` | string | No | Reporter email | `"john@example.com"` |
| `--url` | string | No | Source URL | `"https://support.example.com/ticket/456"` |
| `--wait` | flag | No | Wait for processing to complete | `--wait` |
| `--json` | flag | No | Output in JSON format | `--json` |
| `--page` | number | No | Page number for listing | `--page 2` |
| `--limit` | number | No | Items per page (max 100) | `--limit 20` |

## Feedback Commands

### List AI-Generated Insights

#### Basic List
```bash
cl feedback
# Shows table of AI-generated insights
```

#### With Pagination
```bash
cl feedback --page 2 --limit 5
# Shows page 2 with 5 items per page
```

#### JSON Output
```bash
cl feedback --json
# Output: {"data":[...],"pagination":{...}}
```

### View Specific Insight

#### By ID
```bash
cl feedback 2ea8f556-052b-4f5c-bf86-833780b3d00d
# Shows detailed insight information
```

#### JSON Output
```bash
cl feedback 2ea8f556-052b-4f5c-bf86-833780b3d00d --json
# Output: {"id":"...","title":"...","content":"..."}
```

### Feedback Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `id` | string | Yes* | Insight ID for detailed view | `2ea8f556-052b-4f5c-bf86-833780b3d00d` |
| `--page` | number | No | Page number for listing | `--page 2` |
| `--limit` | number | No | Items per page (max 100) | `--limit 20` |
| `--json` | flag | No | Output in JSON format | `--json` |

*Required only for detailed view

## Team Commands

### Team Website Management

**Why set your product website?** ClosedLoop AI uses your product URL to learn about your product features, competitors, pricing, and positioning. This enables more accurate feedback attribution and product-specific insights. For example, if you're working on iPhone, use `https://apple.com/iphone` - this helps ClosedLoop AI understand that "camera quality" feedback is about iPhone cameras, not just any camera.

#### Show Current Website
```bash
cl team website
# Output: Website: https://example.com
# Updated: 2024-01-15T10:30:00Z
```

#### Set Team Website
```bash
cl team website "https://example.com"
# Output: Team website updated successfully
# Website: https://example.com
# Updated: 2024-01-15T10:30:00Z
```

#### JSON Output
```bash
# Show website in JSON format
cl team website --json
# Output: {"success": true, "data": {"website": "https://example.com", "updated_at": "2024-01-15T10:30:00Z"}}

# Set website in JSON format
cl team website "https://example.com" --json
# Output: {"success": true, "data": {"website": "https://example.com", "updated_at": "2024-01-15T10:30:00Z"}}
```

### Team Management
```bash
cl team
# Shows available team management commands
```

### Team Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `website` | string | No | Team website URL (must include http:// or https://) | `"https://example.com"` |
| `--json` | flag | No | Output in JSON format | `--json` |

### Team Error Handling

#### Invalid Website URL
```bash
cl team website "invalid-url"
# Error: Invalid website URL format. Must include protocol (http:// or https://) and domain
```

#### Missing API Key
```bash
cl team website "https://example.com"
# Error: API key not configured. Run: cl config set --api-key <key>
```

## General Commands

### Version
```bash
cl --version
# Output: 0.2.0

cl version
# Output: 0.2.0
```

### Help
```bash
cl --help
# Shows main help

cl help
# Shows main help

cl help input
# Shows input command help

cl help feedback
# Shows feedback command help
```

### Help Parameters

| Command | Description | Example |
|---------|-------------|---------|
| `cl --help` | Main help with all commands | `cl --help` |
| `cl help <command>` | Specific command help | `cl help input` |

## Error Handling

### Common Error Messages

#### No API Key
```bash
cl input "Test feedback"
# Error: 🔑 No API key configured!
# 
# To get started:
# 1. Go to https://closedloop.sh
# 2. Sign up for a free account
# 3. Generate your API key
# 4. Run: cl config --set-api-key <your-key>
```

#### Invalid API Key
```bash
cl input "Test feedback"
# Error: ❌ Invalid API key. Get your free API key at https://closedloop.sh
```

#### Validation Error
```bash
cl input ""
# Error: ❌ Validation Error: Content cannot be empty
```

#### API Error
```bash
cl input "Test feedback"
# Error: ❌ API Error: 500 - Internal server error
```

### Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `NO_API_KEY` | No API key configured | Run `cl config set --api-key <key>` |
| `INVALID_API_KEY` | API key is invalid | Get new key from https://closedloop.sh |
| `VALIDATION_ERROR` | Input validation failed | Check input format and requirements |
| `API_ERROR` | Server error | Check internet connection, try again later |
| `RATE_LIMITED` | Too many requests | Wait and retry |
| `NOT_FOUND` | Resource not found | Check ID is correct |

## Examples

### Basic Workflow
```bash
# 1. Configure API key
cl config set --api-key your-api-key-here

# 2. Ingest customer product feedback
cl ingest "The new dashboard is confusing and hard to navigate"

# 3. Wait for AI analysis
cl ingest "Customer complaint about performance" --wait

# 4. View AI-generated insights
cl feedback

# 5. Get detailed insight
cl feedback 2ea8f556-052b-4f5c-bf86-833780b3d00d
```

### Advanced Workflow
```bash
# 1. Ingest with full metadata
cl ingest "Great product, love the new features!" \
  --title "Positive Feedback" \
  --customer "enterprise-123" \
  --name "Jane Smith" \
  --email "jane@example.com" \
  --url "https://support.example.com/ticket/789"

# 2. List all ingests with pagination
cl ingest --page 1 --limit 20

# 3. Get JSON output for scripting
cl feedback --json | jq '.data[0].title'

# 4. View specific ingest details
cl ingest 74e3dd87-878f-41cf-8e5a-87527bbf7770 --json
```

### Scripting Examples
```bash
#!/bin/bash
# ingest-feedback.sh

# Ingest feedback and get ID
ID=$(cl ingest "$1" --json | jq -r '.id')

# Wait for processing
cl ingest "$ID" --wait

# Show results
cl feedback
```

```bash
#!/bin/bash
# get-insights.sh

# Get all insights in JSON format
cl feedback --json | jq '.data[] | {id: .id, title: .title, status: .status}'
```

## Output Formats

### Table Format (Default)
```
┌─────────────────────────────────────┬─────────────────────────────┬─────────────┬─────────────┐
│ ID                                  │ Title                      │ Status      │ Created     │
├─────────────────────────────────────┼─────────────────────────────┼─────────────┼─────────────┤
│ 74e3dd87-878f-41cf-8e5a-87527bbf7770 │ Dashboard UX Issues        │ completed   │ 2024-01-15  │
│ 2ea8f556-052b-4f5c-bf86-833780b3d00d │ Performance Problems       │ processing  │ 2024-01-15  │
└─────────────────────────────────────┴─────────────────────────────┴─────────────┴─────────────┘
```

### JSON Format
```json
{
  "data": [
    {
      "id": "74e3dd87-878f-41cf-8e5a-87527bbf7770",
      "title": "Dashboard UX Issues",
      "content": "The new dashboard is confusing...",
      "status": "completed",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

## Best Practices

### 1. Use Descriptive Titles
```bash
# Good
cl ingest "The app crashes when uploading files" --title "File Upload Crash"

# Bad
cl ingest "App broken" --title "Issue"
```

### 2. Include Customer Context
```bash
# Good
cl ingest "Feature request" --customer "enterprise-123" --name "John Doe"

# Bad
cl ingest "Feature request"
```

### 3. Use JSON for Scripting
```bash
# Good
cl feedback --json | jq '.data[0].title'

# Bad
cl feedback | grep "Title"
```

### 4. Handle Errors Gracefully
```bash
#!/bin/bash
if ! cl ingest "$1" --wait; then
  echo "Failed to ingest feedback"
  exit 1
fi
```

### 5. Use Pagination for Large Datasets
```bash
# Good - increase limit for larger datasets
cl ingest --page 1 --limit 50

# Also good - use default pagination
cl ingest --page 2  # Shows 20 items per page (default)

# Bad - trying to show too many at once
cl ingest --limit 200  # Will be capped at 100 (max limit)
```

## Troubleshooting

### CLI Not Found
```bash
# Check if installed globally
npm list -g @closedloop-ai/cli

# Reinstall if needed
npm install -g @closedloop-ai/cli
```

### Permission Denied
```bash
# Fix npm permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

### API Key Not Working
```bash
# Check configuration
cl config

# Reset API key
cl config set --api-key your-new-key-here
```

### Slow Performance
```bash
# Check internet connection
ping mcp.closedloop.sh

# Try with smaller batches
cl input --limit 10
```

## Support

- **Documentation**: [https://docs.closedloop.sh](https://docs.closedloop.sh)
- **GitHub Issues**: [https://github.com/closed-loop-ai/closedloop-cli/issues](https://github.com/closed-loop-ai/closedloop-cli/issues)
- **Email**: support@closedloop.sh
