# Contributing to Auctions Frontend

Thank you for your interest in contributing to this project! This document provides guidelines and standards for development.

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd auctions-fe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm start
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 📋 Development Guidelines

This project follows strict Angular best practices and coding standards. **All contributors must adhere to these guidelines.**

### For AI-Assisted Development

If you're using AI assistants (Cursor, GitHub Copilot, ChatGPT, Claude, etc.), please review:

- **[Angular Best Practices](.cursorrules)** - Comprehensive coding guidelines
- **[AI Guidelines](docs/AI_GUIDELINES.md)** - Portable version for all AI tools

### Key Principles

1. **Modern Angular 19+**

   - Use standalone components
   - Use signals for state management (zoneless app)
   - Use modern control flow (`@if`, `@for`, `@switch`)
   - Use `inject()` function instead of constructor injection

2. **File Structure**

   - Each component MUST have 4 files: `.ts`, `.html`, `.scss`, `.spec.ts`
   - Each page MUST have its own service and interface files
   - Never use inline templates or styles

3. **Type Safety**

   - **NO `any` types allowed**
   - All types must be properly defined
   - Create interface files per page/feature

4. **Testing**

   - **Every method must have corresponding tests**
   - Test both success and error scenarios
   - Test signal state changes

5. **UI Components**

   - Use PrimeNG components only
   - Style with Tailwind CSS utility classes
   - No custom UI components

6. **Forms**

   - Use template-driven forms only
   - No reactive forms/FormGroups

7. **SSR Compatibility**
   - Never use `localStorage` (use cookies instead)
   - Always check platform before using browser-only APIs

## 🔧 Technical Stack

- **Framework**: Angular 19+ (Standalone Components)
- **State Management**: Angular Signals
- **UI Library**: PrimeNG
- **Styling**: Tailwind CSS
- **Forms**: Template-driven
- **Rendering**: Server-Side Rendering (SSR)
- **Testing**: Jasmine/Karma

## 📝 Code Review Checklist

Before submitting a PR, ensure:

- [ ] All components have `.ts`, `.html`, `.scss`, and `.spec.ts` files
- [ ] All state uses Signals
- [ ] Using modern Angular syntax (`@if`, `@for`, etc.)
- [ ] Using `inject()` function
- [ ] All API calls have error handling
- [ ] No `any` types - all properly typed
- [ ] Using PrimeNG components
- [ ] Using Tailwind utility classes
- [ ] Template-driven forms only
- [ ] No `localStorage` usage
- [ ] All methods have tests
- [ ] Tests cover success and error scenarios

## 🎨 Code Style

This project uses:

- **Prettier** for code formatting
- **ESLint** for linting
- **EditorConfig** for consistent editor settings

Your IDE should automatically pick up the settings from:

- `.editorconfig`
- `.eslintrc.json`
- `.prettierrc`

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                    # Core services, guards, interceptors
│   │   ├── guards/
│   │   ├── services/
│   │   └── interceptors/
│   ├── pages/                   # Page components
│   │   └── [page-name]/
│   │       ├── [page-name].ts
│   │       ├── [page-name].html
│   │       ├── [page-name].scss
│   │       ├── [page-name].spec.ts
│   │       ├── [page-name].service.ts
│   │       └── [page-name].interface.ts
│   ├── components/              # Reusable components
│   │   └── shared/
│   └── app.routes.ts
└── styles.css
```

## 🧪 Testing Guidelines

### Component Tests

- Test component creation
- Test rendering with different states
- Test user interactions
- Test signal state changes
- Test error handling

### Service Tests

- Mock HTTP requests with `HttpTestingController`
- Test success scenarios
- Test error scenarios
- Test state management

### Guard Tests

- Test allowed access
- Test blocked access
- Test redirects

## 🐛 Reporting Issues

When reporting issues, please include:

- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/environment information

## 💡 Feature Requests

Feature requests are welcome! Please:

1. Check if the feature already exists
2. Describe the use case
3. Explain the expected behavior
4. Provide examples if possible

## 📖 Additional Documentation

- [Architecture Documentation](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the project's coding standards

## 📄 License

This project is licensed under [LICENSE NAME] - see the LICENSE file for details.

## ❓ Questions?

If you have questions, please:

1. Check the documentation
2. Search existing issues
3. Create a new issue with the "question" label

---

**Happy Coding! 🎉**
