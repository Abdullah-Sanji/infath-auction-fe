# UI Library Storybook Configuration

This directory contains the Storybook configuration for the `@auctions-fe/ui` library.

## Files

### main.ts
Main Storybook configuration file that defines:
- Story file patterns
- Framework settings (Angular)
- Addon configuration
- Documentation settings

### preview.ts
Preview configuration that controls:
- Global parameters
- Control matchers
- Documentation settings
- Tags configuration

### preview-head.html
HTML head customization that loads:
- PrimeNG theme CSS
- PrimeIcons font
- Custom styling for canvas

### tsconfig.json
TypeScript configuration for Storybook, extending the library's base TypeScript configuration.

## Quick Start

```bash
# Start Storybook
nx run ui:storybook

# Build Storybook
nx run ui:build-storybook
```

## Customization

### Adding Custom Styles

Edit `preview-head.html` to add custom CSS or external stylesheets.

### Configuring Controls

Edit `preview.ts` to customize control behavior:

```typescript
parameters: {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
}
```

### Adding Addons

To add Storybook addons, first install them, then update `main.ts`:

```typescript
addons: [
  '@storybook/addon-essentials',
  '@storybook/addon-a11y',
],
```

## Learn More

- See `STORYBOOK.md` in the library root for detailed documentation
- See `STORYBOOK_SETUP.md` in the project root for setup information

