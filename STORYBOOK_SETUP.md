# Storybook Integration Setup

This document describes the Storybook integration that has been added to the `libs/ui` library.

## What Was Done

### 1. Installed Storybook

```bash
npx nx add @nx/storybook
npx nx g @nx/angular:storybook-configuration ui --interactionTests=true --tsConfiguration=true
```

This added:
- `@storybook/angular` and `@nx/storybook` packages
- Storybook configuration files in `libs/ui/.storybook/`
- Nx targets for running and building Storybook

### 2. Created Configuration Files

**libs/ui/.storybook/main.ts**
- Configures story file locations
- Enables automatic documentation generation
- Sets up Angular framework integration

**libs/ui/.storybook/preview.ts**
- Configures global parameters
- Sets up controls and docs

**libs/ui/.storybook/preview-head.html**
- Loads PrimeNG styles (theme, icons, base styles)
- Ensures components render correctly in Storybook

**libs/ui/.storybook/tsconfig.json**
- TypeScript configuration for Storybook

### 3. Created Comprehensive Stories

Created story files for all components in the UI library:

- **Button** (`button.stories.ts`) - 18 stories covering all variants
- **InputText** (`input-text.stories.ts`) - 15 stories with different configurations
- **Dropdown** (`dropdown.stories.ts`) - 15 stories including virtual scroll
- **MultiSelect** (`multi-select.stories.ts`) - 16 stories with grouped options

Each story file demonstrates:
- Component variants
- Different sizes
- All states (disabled, loading, invalid, etc.)
- Edge cases and advanced features

### 4. Updated Project Configuration

Added Nx targets to `libs/ui/project.json`:
- `storybook` - Start Storybook dev server
- `build-storybook` - Build static Storybook
- `test-storybook` - Run interaction tests
- `static-storybook` - Serve built Storybook

## Available Commands

### Development

```bash
# Start Storybook for the UI library
nx run ui:storybook

# Or use shorthand
nx storybook ui
```

Storybook will be available at `http://localhost:4400`

### Production Build

```bash
# Build static Storybook for deployment
nx run ui:build-storybook

# Output will be in: dist/storybook/ui
```

### Serve Static Build

```bash
# Serve the built Storybook
nx run ui:static-storybook
```

## Component Library Structure

```
libs/ui/
├── .storybook/              # Storybook configuration
│   ├── main.ts             # Main Storybook config
│   ├── preview.ts          # Preview configuration
│   ├── preview-head.html   # HTML head for styles
│   └── tsconfig.json       # TypeScript config
├── src/
│   └── lib/
│       ├── button/
│       │   ├── button.ts
│       │   ├── button.html
│       │   ├── button.scss
│       │   ├── button.spec.ts
│       │   └── button.stories.ts  ⭐ New!
│       ├── input-text/
│       │   ├── input-text.ts
│       │   ├── input-text.html
│       │   ├── input-text.scss
│       │   ├── input-text.spec.ts
│       │   └── input-text.stories.ts  ⭐ New!
│       ├── dropdown/
│       │   └── dropdown.stories.ts  ⭐ New!
│       └── multi-select/
│           └── multi-select.stories.ts  ⭐ New!
└── STORYBOOK.md            # Detailed documentation
```

## Features

### Automatic Documentation

Stories include `autodocs` tag for automatic documentation generation based on:
- Component properties
- TypeScript types
- ArgTypes configuration
- JSDoc comments

### Interactive Controls

All component properties are exposed as interactive controls in Storybook, allowing you to:
- Change property values in real-time
- See immediate visual feedback
- Understand component behavior
- Test edge cases

### Multiple Variants

Each component has stories for:
- **Visual variants**: filled, outlined, etc.
- **Sizes**: small, large
- **States**: disabled, readonly, invalid, loading
- **Special features**: icons, badges, filters, virtual scroll

## Best Practices for Story Writing

### 1. Comprehensive Coverage

Cover all component variants:
```typescript
export const Primary: Story = { args: { severity: 'primary' } };
export const Secondary: Story = { args: { severity: 'secondary' } };
export const Success: Story = { args: { severity: 'success' } };
// ... etc
```

### 2. Descriptive Names

Use clear, descriptive names:
```typescript
export const WithIcon: Story = { ... };
export const LoadingState: Story = { ... };
export const DisabledButton: Story = { ... };
```

### 3. Document Properties

Use argTypes to document:
```typescript
argTypes: {
  label: {
    control: 'text',
    description: 'Button label text',
  },
  severity: {
    control: 'select',
    options: ['primary', 'secondary', 'success'],
    description: 'Button color scheme',
  },
}
```

### 4. Realistic Examples

Use realistic data:
```typescript
const cityOptions = [
  { name: 'New York', code: 'NY' },
  { name: 'London', code: 'LDN' },
  // ...
];
```

## Angular 19+ Features in Storybook

All components use modern Angular 19+ features:

```typescript
// Signal inputs
label = input<string>('Click me');

// Signal outputs
onClick = output<MouseEvent>();

// Two-way binding with model
value = model<string>('');

// Computed signals
isDisabled = computed(() => this.loading() || this.disabled());
```

These work seamlessly in Storybook!

## CI/CD Integration

### Build for Production

```bash
nx run ui:build-storybook:ci
```

### Deploy

The built Storybook in `dist/storybook/ui` is a static site that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting service

Example deployment to Netlify:
```bash
npm install -g netlify-cli
nx run ui:build-storybook
netlify deploy --dir=dist/storybook/ui --prod
```

## Troubleshooting

### Issue: Storybook won't start

**Solution:**
```bash
# Clear Nx cache
nx reset

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try again
nx run ui:storybook
```

### Issue: Components not styled correctly

**Solution:**
1. Check that `preview-head.html` exists
2. Verify PrimeNG CDN links are accessible
3. Check browser console for CSS loading errors

### Issue: TypeScript errors in stories

**Solution:**
1. Verify `libs/ui/.storybook/tsconfig.json` exists
2. Check that story file imports match component exports
3. Run `nx run ui:lint` to see detailed errors

## Next Steps

### For New Components

When adding new components to the library:

1. **Create component files**
   ```
   component.ts
   component.html
   component.scss
   component.spec.ts
   ```

2. **Create story file**
   ```typescript
   // component.stories.ts
   import type { Meta, StoryObj } from '@storybook/angular';
   import { Component } from './component';

   const meta: Meta<Component> = {
     component: Component,
     title: 'UI Components/Component',
     tags: ['autodocs'],
   };

   export default meta;
   type Story = StoryObj<Component>;

   export const Default: Story = {
     args: { /* ... */ },
   };
   ```

3. **Test in Storybook**
   ```bash
   nx run ui:storybook
   ```

4. **Add documentation**
   - Update `STORYBOOK.md` if needed
   - Add JSDoc comments to component

### For Enhanced Features

Consider adding:
- **Interaction testing** with `@storybook/test`
- **Accessibility testing** with `@storybook/addon-a11y`
- **Visual regression testing** with Chromatic
- **MDX documentation** for complex components

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Nx Storybook Guide](https://nx.dev/recipes/storybook)
- [PrimeNG Components](https://primeng.org/)
- [Angular Storybook](https://storybook.js.org/docs/angular)

---

**Created:** October 29, 2025
**Storybook Version:** 9.1.16
**Angular Version:** 20.3.7

