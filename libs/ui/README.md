# @auctions-fe/ui

A shared UI component library for the Auctions FE project, providing Angular wrapper components for PrimeNG components with full type safety and Angular 19+ compatibility.

## Overview

This library wraps PrimeNG components (InputText, Button, Select/Dropdown, and MultiSelect) to provide:

- **Full Type Safety**: All PrimeNG properties and events are properly typed
- **Angular 19+ Compatibility**: Uses modern Angular signals and control flow
- **Zoneless Support**: Built with signals for zoneless change detection
- **ControlValueAccessor**: Form integration support with template-driven and reactive forms
- **Reusability**: Shared across all apps in the monorepo

## Installation

The library is already configured in your Nx workspace. To use it in any app:

```typescript
import { InputText, Button, Dropdown, MultiSelect } from '@auctions-fe/ui';

@Component({
  imports: [InputText, Button, Dropdown, MultiSelect],
  // ...
})
```

## Components

### 1. InputText (`lib-input-text`)

A wrapper for PrimeNG's InputText component.

**Properties:**
- `value` (model): Two-way bindable string value
- `variant`: 'filled' | 'outlined' (default: 'outlined')
- `placeholder`: Placeholder text
- `disabled`: Disable the input
- `readonly`: Make input read-only
- `maxlength`: Maximum character length
- `size`: 'small' | 'large'
- `invalid`: Mark as invalid
- `type`: Input type (default: 'text')
- `autocomplete`: Autocomplete attribute
- `ariaLabel`: ARIA label
- `ariaLabelledBy`: ARIA labelled by
- `ariaDescribedBy`: ARIA described by
- `fluid`: Full width

**Events:**
- `onInput`: Emitted on input
- `onBlur`: Emitted on blur
- `onFocus`: Emitted on focus
- `onKeyDown`: Emitted on key down
- `onKeyUp`: Emitted on key up
- `onPaste`: Emitted on paste

**Example:**

```html
<lib-input-text
  [(value)]="username"
  [placeholder]="'Enter username'"
  [disabled]="false"
  [invalid]="isInvalid()"
  (onInput)="handleInput($event)"
  (onBlur)="handleBlur($event)"
/>
```

**Template-driven form example:**

```html
<form #myForm="ngForm">
  <lib-input-text
    [(ngModel)]="email"
    name="email"
    [placeholder]="'Email'"
    [type]="'email'"
    [invalid]="emailControl.invalid && emailControl.touched"
  />
</form>
```

---

### 2. Button (`lib-button`)

A wrapper for PrimeNG's Button component.

**Properties:**
- `label`: Button label text
- `icon`: Icon class (e.g., 'pi pi-check')
- `iconPos`: 'left' | 'right' | 'top' | 'bottom' (default: 'left')
- `badge`: Badge value
- `badgeClass`: Custom badge CSS class
- `badgeSeverity`: Badge severity level
- `loading`: Show loading state
- `loadingIcon`: Custom loading icon
- `disabled`: Disable button
- `severity`: Button severity ('success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast')
- `raised`: Raised style
- `rounded`: Rounded style
- `text`: Text style
- `plain`: Plain style
- `outlined`: Outlined style
- `link`: Link style
- `size`: 'small' | 'large'
- `type`: 'button' | 'submit' | 'reset' (default: 'button')
- `ariaLabel`: ARIA label
- `fluid`: Full width

**Events:**
- `onClick`: Emitted on click (not emitted when disabled or loading)
- `onFocus`: Emitted on focus
- `onBlur`: Emitted on blur

**Example:**

```html
<lib-button
  [label]="'Save'"
  [icon]="'pi pi-check'"
  [severity]="'success'"
  [loading]="isSaving()"
  [disabled]="!isValid()"
  (onClick)="handleSave()"
/>

<!-- Icon-only button -->
<lib-button
  [icon]="'pi pi-trash'"
  [severity]="'danger'"
  [rounded]="true"
  [text]="true"
  (onClick)="handleDelete()"
/>

<!-- With content projection -->
<lib-button [outlined]="true">
  <span class="font-bold">Custom Content</span>
</lib-button>
```

---

### 3. Dropdown (`lib-dropdown`)

A wrapper for PrimeNG's Select component.

**Properties:**
- `value` (model): Two-way bindable selected value
- `options`: Array of options
- `optionLabel`: Property name for option label
- `optionValue`: Property name for option value
- `optionDisabled`: Property name for disabled state
- `placeholder`: Placeholder text (default: 'Select')
- `disabled`: Disable the dropdown
- `readonly`: Make dropdown read-only
- `filter`: Enable filtering
- `filterBy`: Property to filter by
- `showClear`: Show clear button
- `scrollHeight`: Dropdown scroll height (default: '200px')
- `virtualScroll`: Enable virtual scrolling
- `virtualScrollItemSize`: Virtual scroll item size
- `editable`: Allow manual input
- `maxlength`: Maximum input length (editable mode)
- `ariaLabel`: ARIA label
- `ariaLabelledBy`: ARIA labelled by
- `loading`: Show loading state
- `loadingIcon`: Custom loading icon
- `checkmark`: Show checkmark on selection
- `invalid`: Mark as invalid
- `variant`: 'filled' | 'outlined' (default: 'outlined')
- `fluid`: Full width

**Template Inputs:**
- `itemTemplate`: Template for items
- `selectedItemTemplate`: Template for selected item
- `headerTemplate`: Template for header
- `footerTemplate`: Template for footer
- `emptyTemplate`: Template for empty state
- `emptyFilterTemplate`: Template for empty filter state

**Events:**
- `onChange`: Emitted on value change
- `onFocus`: Emitted on focus
- `onBlur`: Emitted on blur
- `onShow`: Emitted when dropdown opens
- `onHide`: Emitted when dropdown closes
- `onFilter`: Emitted on filter
- `onClear`: Emitted on clear

**Example:**

```typescript
// Component
categories = signal([
  { label: 'Electronics', value: 'electronics' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Books', value: 'books' }
]);
selectedCategory = signal<string | null>(null);
```

```html
<!-- Simple dropdown -->
<lib-dropdown
  [(value)]="selectedCategory"
  [options]="categories()"
  [optionLabel]="'label'"
  [optionValue]="'value'"
  [placeholder]="'Select a category'"
  [filter]="true"
  [showClear]="true"
  (onChange)="handleCategoryChange($event)"
/>

<!-- With custom template -->
<lib-dropdown
  [(value)]="selectedCountry"
  [options]="countries()"
  [optionLabel]="'name'"
  [filter]="true"
  [itemTemplate]="countryItemTemplate"
/>

<ng-template #countryItemTemplate let-country>
  <div class="flex items-center gap-2">
    <img [src]="country.flag" class="w-6 h-4" />
    <span>{{ country.name }}</span>
  </div>
</ng-template>
```

---

### 4. MultiSelect (`lib-multi-select`)

A wrapper for PrimeNG's MultiSelect component.

**Properties:**
- `value` (model): Two-way bindable array of selected values
- `options`: Array of options
- `optionLabel`: Property name for option label
- `optionValue`: Property name for option value
- `optionDisabled`: Property name for disabled state
- `optionGroupLabel`: Property for group label
- `optionGroupChildren`: Property for group children (default: 'items')
- `placeholder`: Placeholder text (default: 'Select items')
- `disabled`: Disable the multiselect
- `readonly`: Make multiselect read-only
- `filter`: Enable filtering (default: true)
- `filterBy`: Property to filter by
- `filterLocale`: Filter locale
- `showToggleAll`: Show toggle all checkbox (default: true)
- `selectAll`: Select all on mount
- `showClear`: Show clear button
- `scrollHeight`: Dropdown scroll height (default: '200px')
- `emptyMessage`: Empty message (default: 'No results found')
- `emptyFilterMessage`: Empty filter message (default: 'No results found')
- `virtualScroll`: Enable virtual scrolling
- `virtualScrollItemSize`: Virtual scroll item size
- `group`: Enable grouping
- `maxSelectedLabels`: Max labels to show (default: 3)
- `selectedItemsLabel`: Label format for selected items (default: '{0} items selected')
- `showHeader`: Show header (default: true)
- `ariaLabel`: ARIA label
- `ariaLabelledBy`: ARIA labelled by
- `loading`: Show loading state
- `loadingIcon`: Custom loading icon
- `display`: 'comma' | 'chip' (default: 'comma')
- `invalid`: Mark as invalid
- `variant`: 'filled' | 'outlined' (default: 'outlined')
- `fluid`: Full width

**Template Inputs:**
- `itemTemplate`: Template for items
- `selectedItemsTemplate`: Template for selected items
- `groupTemplate`: Template for groups
- `headerTemplate`: Template for header
- `filterTemplate`: Template for filter
- `footerTemplate`: Template for footer
- `emptyTemplate`: Template for empty state
- `emptyFilterTemplate`: Template for empty filter state

**Events:**
- `onChange`: Emitted on value change
- `onFocus`: Emitted on focus
- `onBlur`: Emitted on blur
- `onShow`: Emitted when dropdown opens
- `onHide`: Emitted when dropdown closes
- `onFilter`: Emitted on filter
- `onClear`: Emitted on clear
- `onSelectAllChange`: Emitted on select all toggle

**Example:**

```typescript
// Component
tags = signal([
  { name: 'Angular', code: 'ng' },
  { name: 'React', code: 'react' },
  { name: 'Vue', code: 'vue' },
  { name: 'Svelte', code: 'svelte' }
]);
selectedTags = signal<string[]>([]);
```

```html
<!-- Simple multi-select -->
<lib-multi-select
  [(value)]="selectedTags"
  [options]="tags()"
  [optionLabel]="'name'"
  [optionValue]="'code'"
  [placeholder]="'Select technologies'"
  [filter]="true"
  [display]="'chip'"
  [maxSelectedLabels]="5"
  (onChange)="handleTagsChange($event)"
/>

<!-- With grouping -->
<lib-multi-select
  [(value)]="selectedItems"
  [options]="groupedOptions()"
  [optionLabel]="'label'"
  [optionValue]="'value'"
  [group]="true"
  [optionGroupLabel]="'label'"
  [optionGroupChildren]="'items'"
  [placeholder]="'Select items'"
/>
```

---

## Form Integration

All components implement `ControlValueAccessor` and work seamlessly with Angular forms.

### Template-Driven Forms

```html
<form #myForm="ngForm">
  <lib-input-text
    [(ngModel)]="username"
    name="username"
    required
    minlength="3"
    #usernameControl="ngModel"
    [invalid]="usernameControl.invalid && usernameControl.touched"
  />
  
  <lib-dropdown
    [(ngModel)]="category"
    name="category"
    [options]="categories()"
    required
    #categoryControl="ngModel"
    [invalid]="categoryControl.invalid && categoryControl.touched"
  />
  
  <lib-button
    [label]="'Submit'"
    [type]="'submit'"
    [disabled]="myForm.invalid"
  />
</form>
```

### Reactive Forms

```typescript
form = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  tags: new FormControl<string[]>([])
});
```

```html
<form [formGroup]="form">
  <lib-input-text
    formControlName="email"
    [type]="'email'"
    [invalid]="form.controls.email.invalid && form.controls.email.touched"
  />
  
  <lib-multi-select
    formControlName="tags"
    [options]="availableTags()"
  />
</form>
```

---

## Building the Library

To build the library:

```bash
npx nx build ui
```

The built library will be available at `dist/libs/ui`.

---

## Testing

Each component includes comprehensive unit tests. To run tests:

```bash
npx nx test ui
```

---

## Development Guidelines

When working with these components:

1. **Always use Signals**: The components are built with signals for zoneless compatibility
2. **Type Safety**: All properties are strongly typed - no `any` types
3. **Template Syntax**: Use modern Angular control flow (`@if`, `@for`, `@switch`)
4. **Error Handling**: Components handle edge cases gracefully
5. **Accessibility**: All components support ARIA attributes

---

## Architecture

Each component follows this structure:

```
component-name/
├── component-name.ts        # Component logic
├── component-name.html      # Template
├── component-name.scss      # Styles
└── component-name.spec.ts   # Unit tests
```

Components use:
- **Signals** for reactive state management
- **Input signals** for component inputs
- **Output emitters** for events
- **Model signals** for two-way binding
- **ControlValueAccessor** for form integration

---

## Contributing

When adding new components:

1. Follow the existing component structure
2. Wrap PrimeNG components, don't create custom UI from scratch
3. Include comprehensive tests covering all inputs/outputs
4. Use TypeScript strictly (no `any` types)
5. Support both template-driven and reactive forms
6. Follow Angular 19+ best practices

---

## License

Internal library for the Auctions FE project.
