# Documentation

This directory contains comprehensive documentation for the Auctions Frontend application.

## 📚 Available Documentation

### For Developers

- **[AI Guidelines](AI_GUIDELINES.md)** - Complete Angular best practices for AI-assisted development
- **[Architecture](ARCHITECTURE.md)** - System architecture and technical design
- **[Contributing Guide](../CONTRIBUTING.md)** - How to contribute to the project
- **[Keycloak Integration](KEYCLOAK_INTEGRATION.md)** - Authentication setup and configuration
- **[Auth Quick Start](AUTH_QUICK_START.md)** - Quick authentication guide

### Integrations

- **[GTM Integration](GTM_INTEGRATION.md)** - Google Tag Manager setup and usage guide
- **[GTM Usage Examples](GTM_USAGE_EXAMPLES.md)** - Real-world GTM tracking examples
- **[Grafana Integration](GRAFANA_INTEGRATION.md)** - Frontend observability with Grafana Faro

### Quick Links

- **[.cursorrules](../.cursorrules)** - Cursor IDE AI instructions
- **[.editorconfig](../.editorconfig)** - Editor configuration
- **[GitHub Copilot Instructions](../.github/copilot-instructions.md)** - GitHub Copilot guidelines

## 🚀 Getting Started

1. **First time here?** Start with [CONTRIBUTING.md](../CONTRIBUTING.md)
2. **Using AI tools?** Read [AI_GUIDELINES.md](AI_GUIDELINES.md)
3. **Want to understand the system?** Check [ARCHITECTURE.md](ARCHITECTURE.md)

## 📖 Documentation Structure

```
docs/
├── README.md                  # This file
├── AI_GUIDELINES.md           # AI development guidelines
├── ARCHITECTURE.md            # Technical architecture
├── KEYCLOAK_INTEGRATION.md    # Keycloak auth setup
├── AUTH_QUICK_START.md        # Quick auth guide
├── GTM_INTEGRATION.md         # Google Tag Manager guide
├── GTM_USAGE_EXAMPLES.md      # GTM code examples
└── GRAFANA_INTEGRATION.md     # Grafana observability setup

Root Files:
├── CONTRIBUTING.md            # Contribution guidelines
├── .cursorrules              # Cursor AI instructions
├── .editorconfig             # Editor settings
└── .github/
    └── copilot-instructions.md  # GitHub Copilot instructions
```

## 🔄 Keeping Documentation Updated

When updating development guidelines:

1. Update `.cursorrules` (source of truth)
2. Sync to `AI_GUIDELINES.md`
3. Sync to `.github/copilot-instructions.md`
4. Update `CONTRIBUTING.md` if needed

You can use this command to sync:

```bash
cp .cursorrules docs/AI_GUIDELINES.md
cp .cursorrules .github/copilot-instructions.md
```

## 💡 Contributing to Documentation

Documentation improvements are always welcome! Please:

1. Keep it clear and concise
2. Use examples where appropriate
3. Update all related files
4. Test code examples
5. Follow markdown best practices

## ❓ Questions?

If documentation is unclear or missing:

1. Create an issue with the "documentation" label
2. Suggest improvements
3. Submit a PR with updates

---

**Happy Coding! 🎉**
