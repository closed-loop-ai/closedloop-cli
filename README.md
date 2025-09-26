# ClosedLoop AI CLI

> Transform scattered customer product feedback into actionable strategic insights with AI-powered analysis

[![npm version](https://badge.fury.io/js/%40closedloop-ai%2Fcli.svg)](https://badge.fury.io/js/%40closedloop-ai%2Fcli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)

## 🎯 The Problem You're Solving

**Product teams are drowning in scattered product feedback** from multiple channels:
- Support tickets scattered across Zendesk, Intercom, and email
- Sales and customer success call insights buried in transcripts  
- User surveys and feedback forms in different tools
- Social media mentions and app store reviews
- Internal team discussions in Slack

**The result?** Critical customer product feedback get lost, patterns go unnoticed, and product decisions are made without data.

## ✨ How ClosedLoop AI CLI Solves This

**Transform chaos into clarity** with autonomous AI that:

- 🔍 **Discovers Hidden Patterns** - AI finds insights humans would miss across all your feedback sources
- ⚡ **Real-Time Analysis** - Get instant insights as new customer product feedback comes in
- 📊 **Strategic Intelligence** - Convert customer voice into actionable product decisions
- 🎯 **Revenue Impact** - Quantify the business value of each customer feedback
- 🔄 **Source Agnostic** - Works with any data source through flexible APIs

## 🚀 Quick Start

### Installation

```bash
# Install globally for CLI usage
npm install -g @closedloop-ai/cli
```

### Get Your API Key

1. Visit [https://closedloop.sh](https://closedloop.sh)
2. Sign up for a free account (100,000 credits every month included!)
3. Generate your API key
4. Configure the CLI:

```bash
cl config set --api-key your-api-key-here
```

### Set Your Product Website (Important!)

Configure your product's website URL to help ClosedLoop understand your product context:

```bash
cl team website "https://yourproduct.com/feature"
```

**Why this matters:** ClosedLoop uses your product URL to learn about your product features, competitors, pricing, and positioning. This enables more accurate feedback attribution and product-specific insights. For example, if you're working on iPhone, use `https://apple.com/iphone` - this helps ClosedLoop understand that "camera quality" feedback is about iPhone cameras, not just any camera.

### Submit Your First Customer Feedback

```bash
# Submit raw customer feedback for AI analysis
cl input "The new dashboard is confusing and hard to navigate. I can't find the settings menu and the layout is cluttered."

# Wait for AI to analyze and generate structured insights
cl input "Customer complaint about performance issues" --wait

# View all AI-generated customer product feedback
cl feedback

# Get detailed analysis of a specific insight
cl feedback 2ea8f556-052b-4f5c-bf86-833780b3d00d
```

## 🎯 Perfect For

### Customer Success Teams
- **Stop losing critical insights** buried in support tickets
- **Identify patterns** across customer conversations
- **Proactive customer success** with early warning signals
- **Data-driven customer health** scoring

### Product Managers  
- **Prioritize features** based on real customer needs
- **Quantify business impact** of product decisions
- **Track feature adoption** and customer satisfaction
- **Competitive intelligence** from customer feedback

### Business Analysts
- **Strategic insights** from customer behavior patterns
- **Revenue impact** analysis of customer feedback
- **Market intelligence** and trend analysis
- **ROI calculations** for product investments

## 📖 CLI Commands

### Submit Customer Feedback

```bash
# Basic submission
cl input "The app crashes when I try to upload large files"

# With metadata for better analysis
cl input "Great product, love the new features!" \
  --title "Positive Feedback" \
  --customer "customer-456" \
  --name "Jane Smith" \
  --email "jane@example.com" \
  --url "https://support.example.com/ticket/789"

# Wait for AI analysis to complete
cl input "Customer complaint about performance" --wait
```

### View AI-Generated Customer Product Feedback

```bash
# List all structured insights
cl feedback

# View specific insight details
cl feedback <insight-id>

# Get JSON output for scripting
cl feedback --json | jq '.data[0].title'
```

### Manage Your Data

```bash
# List all customer feedback submitted
cl input

# View specific feedback details
cl input <feedback-id>

# Check processing status
cl input <feedback-id> --status
```

## 🔧 Configuration

The CLI stores configuration in `~/.closedloop/config.json`:

```json
{
  "apiKey": "your-api-key-here"
}
```

### Environment Variables

```bash
export CLOSEDLOOP_API_KEY="your-api-key-here"
```

## 💡 Real-World Examples

### Customer Success Team
```bash
# Process support ticket feedback
cl input "Customer can't find the export feature in the new UI" \
  --title "Export Feature Missing" \
  --customer "enterprise-123" \
  --source "zendesk-ticket-456"

# Get AI insights on customer satisfaction trends
cl feedback --severity high
```

### Product Manager
```bash
# Submit user research findings
cl input "Users want better mobile experience - 80% of complaints are mobile-related" \
  --title "Mobile UX Research" \
  --customer "research-participant-789"

# Analyze feature request patterns
cl feedback --category "feature-request"
```

### Business Analyst
```bash
# Process survey responses
cl input "NPS score dropped 15 points this quarter due to performance issues" \
  --title "Q3 NPS Analysis" \
  --customer "survey-respondent-101"

# Get strategic insights for leadership
cl feedback --priority high
```

## 📚 Documentation

- **[Complete CLI Commands Reference](docs/CLI_COMMANDS.md)** - All commands, parameters, and examples
- **[Contributing Guide](CONTRIBUTING.md)** - Development and contribution guidelines

## 🎯 Why This Matters

### Before ClosedLoop AI CLI
- ❌ **Scattered feedback** across 5+ different tools
- ❌ **Manual analysis** taking 20+ hours per week
- ❌ **Missed patterns** and critical insights
- ❌ **Reactive decisions** based on incomplete data
- ❌ **Lost revenue** from unaddressed customer needs

### After ClosedLoop AI CLI
- ✅ **Unified intelligence** from all feedback sources
- ✅ **Automated analysis** with AI pattern recognition
- ✅ **Proactive insights** delivered in real-time
- ✅ **Data-driven decisions** with quantified business impact
- ✅ **Increased revenue** from better customer understanding

## 📊 Business Impact

- **80% faster** analysis time (from 20 hours to 4 hours per week)
- **40% faster** feature prioritization decisions
- **25% increase** in customer satisfaction scores
- **35% increase** in feature adoption rates
- **50% reduction** in failed feature launches

## 🧪 Development

### Prerequisites

- Node.js 16+ 
- npm or yarn
- TypeScript 5+

### Setup

```bash
# Clone the repository
git clone https://github.com/closed-loop-ai/mcp-client.git
cd mcp-client

# Install dependencies
npm install

# Build the CLI
npm run build:cli

# Run tests
npm test
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Platform**: [https://closedloop.sh](https://closedloop.sh)
- **Documentation**: [https://docs.closedloop.sh](https://docs.closedloop.sh)
- **GitHub Issues**: [https://github.com/closed-loop-ai/closedloop-cli/issues](https://github.com/closed-loop-ai/closedloop-cli/issues)
- **NPM Package**: [https://www.npmjs.com/package/@closedloop-ai/cli](https://www.npmjs.com/package/@closedloop-ai/cli)

## 🆘 Support

- **Documentation**: Check our [docs](https://docs.closedloop.sh)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/closed-loop-ai/closedloop-cli/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/closed-loop-ai/closedloop-cli/discussions)
- **Email**: support@closedloop.sh

---

**Made with ❤️ by ClosedLoop AI**

*Transform customer product feedback chaos into strategic product decisions with AI-powered insights.*