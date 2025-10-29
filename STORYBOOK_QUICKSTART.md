# 🚀 Storybook Quick Start Guide

## Start Storybook in 3 Seconds

```bash
npm run storybook
```

That's it! Storybook will open at **http://localhost:4400**

## Alternative Commands

```bash
# Using nx directly
nx run ui:storybook

# Using shorthand
nx storybook ui
```

## What You'll See

When Storybook starts, you'll see:

```
UI Components/
├── Button
│   ├── Primary
│   ├── Secondary
│   ├── Success
│   ├── Info
│   ├── Warning
│   ├── Danger
│   ├── With Icon
│   ├── Icon Right
│   ├── Icon Only
│   ├── Raised
│   ├── Rounded
│   ├── Text
│   ├── Outlined
│   ├── Link
│   ├── Small
│   ├── Large
│   ├── Disabled
│   ├── Loading
│   └── With Badge
│
├── InputText
│   ├── Default
│   ├── With Value
│   ├── Filled
│   ├── Outlined
│   ├── Small
│   ├── Large
│   ├── Disabled
│   ├── Readonly
│   ├── Invalid
│   ├── Password
│   ├── Email
│   ├── Number
│   ├── With Max Length
│   ├── Fluid
│   └── With AutoComplete
│
├── Dropdown
│   ├── Default
│   ├── With Value
│   ├── Object Options
│   ├── With Filter
│   ├── With Clear
│   ├── Filled
│   ├── Outlined
│   ├── Disabled
│   ├── Readonly
│   ├── Invalid
│   ├── Loading
│   ├── Editable
│   ├── With Checkmark
│   ├── Fluid
│   ├── Many Options
│   └── Virtual Scroll
│
└── MultiSelect
    ├── Default
    ├── With Value
    ├── Object Options
    ├── With Filter
    ├── Chip Display
    ├── Comma Display
    ├── Max Selected Labels
    ├── With Clear
    ├── No Toggle All
    ├── Filled
    ├── Outlined
    ├── Disabled
    ├── Readonly
    ├── Invalid
    ├── Loading
    ├── Fluid
    ├── Grouped Options
    ├── Many Options
    ├── Virtual Scroll
    └── All Selected
```

## Interactive Features

### 1. **Controls Panel** (Bottom)
- Adjust component properties in real-time
- See immediate visual updates
- Test different configurations

### 2. **Canvas** (Center)
- View the component
- Interact with it
- Test functionality

### 3. **Docs Tab**
- Auto-generated documentation
- Property descriptions
- Usage examples
- Code snippets

### 4. **Viewport Selector** (Top Toolbar)
- Test responsive designs
- Mobile/Tablet/Desktop views
- Custom viewports

### 5. **Background Selector** (Top Toolbar)
- Test on different backgrounds
- Dark/Light themes
- Custom colors

## Try This Now

1. **Start Storybook:**
   ```bash
   npm run storybook
   ```

2. **Click on "Button > Primary"** in the sidebar

3. **Play with the controls:**
   - Change the `label` text
   - Switch `severity` to different colors
   - Toggle `disabled`
   - Add an `icon` like "pi pi-check"

4. **Check the Docs tab** to see full documentation

## Building for Production

To create a static build:

```bash
npm run build-storybook
```

Output will be in: `dist/storybook/ui/`

This can be deployed to any static hosting service!

## Common Use Cases

### 🎨 Visual Development
Use Storybook as your component playground while developing new UI components.

### 📖 Living Documentation
Share with designers, PMs, and other developers to show what components exist and how to use them.

### 🧪 Manual Testing
Test components in isolation with different property combinations.

### 🎯 Design System
Build and maintain your design system with all components in one place.

### 📱 Responsive Testing
Test components at different screen sizes using the viewport selector.

## Tips & Tricks

### 💡 Keyboard Shortcuts
- `S` - Toggle sidebar
- `F` - Toggle fullscreen
- `A` - Toggle addons panel
- `/` - Search stories
- `↑/↓` - Navigate stories

### 💡 URL Parameters
- Share specific stories with direct links
- Include control values in URLs
- Bookmark your favorite configurations

### 💡 Add More Stories
Create new story files following this pattern:
```typescript
// your-component.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';
import { YourComponent } from './your-component';

const meta: Meta<YourComponent> = {
  component: YourComponent,
  title: 'UI Components/YourComponent',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<YourComponent>;

export const Default: Story = {
  args: {},
};
```

## Need Help?

- 📖 **Detailed docs**: See `libs/ui/STORYBOOK.md`
- 🔧 **Setup info**: See `STORYBOOK_SETUP.md`
- ✅ **Complete guide**: See `STORYBOOK_INTEGRATION_COMPLETE.md`
- 🌐 **Official docs**: https://storybook.js.org/docs

## Quick Commands Reference

| What | Command |
|------|---------|
| Start dev server | `npm run storybook` |
| Build static | `npm run build-storybook` |
| Run tests | `nx run ui:test-storybook` |
| Serve built | `nx run ui:static-storybook` |

---

**Ready?** Just run:
```bash
npm run storybook
```

Enjoy exploring your component library! 🎉

