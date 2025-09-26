# Contributing to ClosedLoop CLI

Thank you for your interest in contributing to the ClosedLoop CLI! We welcome contributions from the community and are grateful for your help in making this project better.

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** 16.0.0 or higher
- **npm** 8.0.0 or higher (or yarn/pnpm)
- **Git** 2.0.0 or higher
- **TypeScript** 5.0.0 or higher

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/closedloop-cli.git
   cd closedloop-cli
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/closed-loop-ai/closedloop-cli.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run tests**
   ```bash
   npm test
   ```

6. **Run linting**
   ```bash
   npm run lint
   ```

## 🏗️ Project Structure

```
closedloop-cli/
├── packages/
│   ├── core/           # TypeScript client library
│   │   ├── src/        # Source code
│   │   ├── dist/       # Compiled output
│   │   └── tests/      # Unit tests
│   ├── cli/            # CLI tool
│   │   ├── src/        # Source code
│   │   ├── dist/       # Compiled output
│   │   └── __tests__/  # Unit tests
│   └── examples/       # Usage examples
├── docs/               # Documentation
├── tests/              # Integration tests
└── .github/            # GitHub workflows and templates
```

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
# Make sure you're on main and up to date
git checkout main
git pull upstream main

# Create a new branch for your feature
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/your-bug-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Build the project
npm run build
```

### 4. Commit Your Changes

We use conventional commits. Please format your commit messages as follows:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(cli): add --wait flag for input processing"
git commit -m "fix(api): handle 401 errors gracefully"
git commit -m "docs: update installation instructions"
```

### 5. Push and Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

## 📝 Code Standards

### TypeScript Guidelines

- Use TypeScript for all new code
- Provide proper type definitions
- Use interfaces for object shapes
- Prefer `const` over `let` when possible
- Use meaningful variable and function names

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Use semicolons
- Use trailing commas in objects and arrays
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces

### Example:

```typescript
interface UserConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

class ClosedLoopClient {
  private config: UserConfig;

  constructor(config: UserConfig) {
    this.config = config;
  }

  async submitFeedback(data: FeedbackData): Promise<SubmissionResult> {
    // Implementation
  }
}
```

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for all new functionality
- Aim for high test coverage (>90%)
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

### Test Structure

```typescript
describe('FeedbackService', () => {
  describe('submitFeedback', () => {
    it('should submit feedback successfully', async () => {
      // Arrange
      const mockData = { content: 'Test feedback' };
      const expectedResult = { id: '123', status: 'submitted' };
      
      // Act
      const result = await feedbackService.submitFeedback(mockData);
      
      // Assert
      expect(result).toEqual(expectedResult);
    });

    it('should handle API errors gracefully', async () => {
      // Test error handling
    });
  });
});
```

### Integration Tests

- Test the CLI commands end-to-end
- Test API integration
- Test error scenarios
- Test configuration handling

## 📚 Documentation Guidelines

### Code Documentation

- Add JSDoc comments for public APIs
- Include parameter descriptions
- Include return value descriptions
- Include usage examples

```typescript
/**
 * Submit customer feedback for AI analysis
 * @param data - The feedback data to submit
 * @param options - Optional configuration
 * @returns Promise resolving to submission result
 * @example
 * ```typescript
 * const result = await client.feedback.create({
 *   content: "The dashboard is confusing",
 *   title: "UX Issue"
 * });
 * ```
 */
async create(data: FeedbackData, options?: CreateOptions): Promise<SubmissionResult> {
  // Implementation
}
```

### README Updates

- Update README.md for new features
- Add examples for new functionality
- Update installation instructions if needed
- Update CLI command documentation

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Environment details** (OS, Node.js version, etc.)
5. **Error messages** or logs
6. **Screenshots** if applicable

### Bug Report Template

```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Run command `cl input "test"`
2. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: macOS 13.0
- Node.js: 18.17.0
- CLI Version: 0.2.0

## Additional Context
Any other relevant information
```

## ✨ Feature Requests

When requesting features, please include:

1. **Clear description** of the feature
2. **Use case** and motivation
3. **Proposed implementation** (if you have ideas)
4. **Alternatives considered**
5. **Additional context**

## 🔍 Pull Request Guidelines

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] All tests pass
- [ ] New tests added for new functionality
- [ ] Documentation updated
- [ ] Commit messages follow conventional format
- [ ] Branch is up to date with main

### PR Description

Include a clear description of your changes:

```markdown
## Description
Brief description of what this PR does

## Changes
- Added new CLI command `cl status`
- Updated error handling for API calls
- Added tests for new functionality

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Breaking Changes
- None (or list any breaking changes)

## Related Issues
Fixes #123
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** on multiple environments
4. **Documentation** review
5. **Approval** and merge

## 🏷️ Release Process

We follow semantic versioning:

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features (backward compatible)
- **PATCH** (0.0.1): Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Release notes prepared
- [ ] NPM package published

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different opinions and approaches
- Help maintain a positive environment

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: support@closedloop.sh for private matters

## 📋 Development Commands

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Clean build artifacts
npm run clean

# Build specific package
npm run build:core
npm run build:cli

# Test specific package
npm run test:core
npm run test:cli
```

## 🎯 Areas for Contribution

We especially welcome contributions in these areas:

- **New CLI commands** and features
- **Improved error handling** and user experience
- **Additional examples** and documentation
- **Performance optimizations**
- **Test coverage improvements**
- **Cross-platform compatibility**
- **Integration examples** for popular frameworks

## 📞 Contact

- **Maintainers**: @closedloop-team
- **Email**: team@closedloop.sh
- **GitHub**: [closed-loop-ai/closedloop-cli](https://github.com/closed-loop-ai/closedloop-cli)

Thank you for contributing to the ClosedLoop CLI! 🎉
