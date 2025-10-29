# Storybook for UI Library

This document provides information about the Storybook integration for the `@auctions-fe/ui` library.

## Overview

Storybook has been configured for the UI library to provide an interactive component development and documentation environment. All components in the library have corresponding story files that demonstrate their usage and variations.

## Getting Started

### Running Storybook

To start Storybook in development mode:

```bash
nx run ui:storybook
```

Or using the shorthand:

```bash
nx storybook ui
```

Storybook will start on `http://localhost:4400` by default.

### Building Storybook

To build a static version of Storybook for deployment:

```bash
nx run ui:build-storybook
```

The static files will be output to `dist/storybook/ui`.

### Serving Static Storybook

To serve the built Storybook:

```bash
nx run ui:static-storybook
```

## Component Stories

Each component in the library has a corresponding `.stories.ts` file that demonstrates:

- **Default state**: Basic component usage
- **Variants**: Different visual styles (filled, outlined, etc.)
- **Sizes**: Small, medium, and large variations
- **States**: Disabled, readonly, invalid, loading states
- **Interactive examples**: Various configurations and use cases

### Available Components

1. **Button** (`libs/ui/src/lib/button/button.stories.ts`)
   - All severity variants (primary, secondary, success, info, warn, danger)
   - Different styles (raised, rounded, text, outlined, link)
   - Icon configurations
   - Loading and disabled states
   - Badge support

2. **InputText** (`libs/ui/src/lib/input-text/input-text.stories.ts`)
   - Filled and outlined variants
   - Different input types (text, password, email, number)
   - Size variations
   - Validation states
   - Max length and autocomplete support

3. **Dropdown** (`libs/ui/src/lib/dropdown/dropdown.stories.ts`)
   - Simple and object-based options
   - Filter functionality
   - Clear button
   - Loading states
   - Virtual scrolling for large datasets

4. **MultiSelect** (`libs/ui/src/lib/multi-select/multi-select.stories.ts`)
   - Chip and comma display modes
   - Grouped options
   - Select all toggle
   - Filter functionality
   - Virtual scrolling support

## Writing Stories

When adding new components to the library, follow these guidelines for creating stories:

### Basic Story Structure

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { YourComponent } from './your-component';

const meta: Meta<YourComponent> = {
  component: YourComponent,
  title: 'UI Components/YourComponent',
  tags: ['autodocs'],
  argTypes: {
    // Define your component's inputs here
    propName: {
      control: 'text', // or 'boolean', 'select', 'number', etc.
      description: 'Description of the property',
    },
  },
};

export default meta;
type Story = StoryObj<YourComponent>;

export const Default: Story = {
  args: {
    // Default property values
  },
};

export const Variant: Story = {
  args: {
    // Different configuration
  },
};
```

### Best Practices

1. **Use descriptive names**: Name your stories clearly (e.g., `Primary`, `Disabled`, `WithIcon`)
2. **Cover all variants**: Create stories for different visual variants and states
3. **Document props**: Use `argTypes` to document component inputs
4. **Group related components**: Use the `title` property to organize stories logically
5. **Add autodocs**: Include the `autodocs` tag for automatic documentation generation

## Storybook Configuration

### Main Configuration

The main Storybook configuration is located at `libs/ui/.storybook/main.ts`:

```typescript
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {
    autodocs: true,
  },
};

export default config;
```

### Preview Configuration

The preview configuration is at `libs/ui/.storybook/preview.ts` and controls the global parameters for all stories.

### Styles

PrimeNG styles are loaded via `libs/ui/.storybook/preview-head.html`, which includes:
- PrimeIcons
- PrimeNG theme (Lara Light Blue)
- PrimeNG base styles

## Integration with Angular 19+

The components use Angular 19+ features:

- **Standalone components**: All components are standalone
- **Signals**: State management uses Angular Signals
- **Input/Output signals**: Modern input/output syntax with `input()` and `output()`
- **Template syntax**: New control flow (`@if`, `@for`, `@switch`)

These features are fully supported in Storybook.

## Continuous Integration

The following Nx targets are available for CI/CD pipelines:

- `nx run ui:build-storybook:ci` - Build Storybook in CI mode (quiet output)
- `nx run ui:static-storybook:ci` - Serve built Storybook in CI mode
- `nx run ui:test-storybook` - Run Storybook interaction tests (requires Storybook to be running)

## Troubleshooting

### Storybook won't start

1. Make sure all dependencies are installed: `npm install`
2. Clear Nx cache: `nx reset`
3. Check for port conflicts (default port is 4400)

### Components not rendering correctly

1. Verify PrimeNG styles are loading in the browser
2. Check browser console for errors
3. Ensure component imports are correct

### Stories not appearing

1. Verify story files follow the naming pattern: `*.stories.ts`
2. Check that stories are in the correct location: `libs/ui/src/lib/**/*.stories.ts`
3. Restart Storybook after adding new story files

## Additional Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Storybook for Angular](https://storybook.js.org/docs/angular/get-started/introduction)
- [PrimeNG Documentation](https://primeng.org/)
- [Nx Storybook Integration](https://nx.dev/recipes/storybook)

## Contributing

When contributing new components to the UI library:

1. Create the component with all four required files (.ts, .html, .scss, .spec.ts)
2. Add a comprehensive `.stories.ts` file with multiple variants
3. Test the component in Storybook before submitting
4. Update this README if adding significant new patterns or features

