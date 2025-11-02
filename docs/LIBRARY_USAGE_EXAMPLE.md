# UI Library Usage Example

## How to Use the @auctions-fe/ui Components

### 1. Import in Your Component

```typescript
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputText, Button, Dropdown, MultiSelect } from '@auctions-fe/ui';

@Component({
  selector: 'app-my-page',
  imports: [FormsModule, InputText, Button, Dropdown, MultiSelect],
  templateUrl: './my-page.html',
  styleUrl: './my-page.scss',
})
export class MyPage {
  // Form state using signals
  username = signal('');
  email = signal('');
  category = signal<string | null>(null);
  tags = signal<string[]>([]);
  isLoading = signal(false);

  // Options for dropdowns
  categories = signal([
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' },
    { label: 'Home & Garden', value: 'home' },
  ]);

  availableTags = signal([
    { name: 'New', code: 'new' },
    { name: 'Featured', code: 'featured' },
    { name: 'Sale', code: 'sale' },
    { name: 'Popular', code: 'popular' },
  ]);

  async handleSubmit(): Promise<void> {
    this.isLoading.set(true);
    
    console.log('Form data:', {
      username: this.username(),
      email: this.email(),
      category: this.category(),
      tags: this.tags(),
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    this.isLoading.set(false);
  }

  handleCategoryChange(event: { originalEvent?: Event; value: unknown }): void {
    console.log('Category changed:', event.value);
  }

  handleTagsChange(event: { originalEvent: Event; value: unknown[]; itemValue?: unknown }): void {
    console.log('Tags changed:', event.value);
  }
}
```

### 2. Template Usage

```html
<!-- my-page.html -->
<div class="container mx-auto p-6 max-w-2xl">
  <h1 class="text-3xl font-bold mb-6">Create Product</h1>

  <form #productForm="ngForm" (ngSubmit)="handleSubmit()" class="space-y-4">
    
    <!-- Input Text Example -->
    <div class="flex flex-col gap-2">
      <label for="username" class="font-semibold">Username</label>
      <lib-input-text
        [(value)]="username"
        [placeholder]="'Enter your username'"
        [disabled]="isLoading()"
        [fluid]="true"
      />
    </div>

    <!-- Input Text with validation -->
    <div class="flex flex-col gap-2">
      <label for="email" class="font-semibold">Email</label>
      <lib-input-text
        [(value)]="email"
        [type]="'email'"
        [placeholder]="'Enter your email'"
        [disabled]="isLoading()"
        [invalid]="email() !== '' && !email().includes('@')"
        [fluid]="true"
      />
      @if (email() !== '' && !email().includes('@')) {
        <small class="text-red-500">Please enter a valid email</small>
      }
    </div>

    <!-- Dropdown Example -->
    <div class="flex flex-col gap-2">
      <label for="category" class="font-semibold">Category</label>
      <lib-dropdown
        [(value)]="category"
        [options]="categories()"
        [optionLabel]="'label'"
        [optionValue]="'value'"
        [placeholder]="'Select a category'"
        [disabled]="isLoading()"
        [filter]="true"
        [showClear]="true"
        [fluid]="true"
        (onChange)="handleCategoryChange($event)"
      />
    </div>

    <!-- MultiSelect Example -->
    <div class="flex flex-col gap-2">
      <label for="tags" class="font-semibold">Tags</label>
      <lib-multi-select
        [(value)]="tags"
        [options]="availableTags()"
        [optionLabel]="'name'"
        [optionValue]="'code'"
        [placeholder]="'Select tags'"
        [disabled]="isLoading()"
        [display]="'chip'"
        [maxSelectedLabels]="5"
        [showClear]="true"
        [fluid]="true"
        (onChange)="handleTagsChange($event)"
      />
    </div>

    <!-- Buttons Example -->
    <div class="flex gap-3 justify-end mt-6">
      <lib-button
        [label]="'Cancel'"
        [severity]="'secondary'"
        [outlined]="true"
        [disabled]="isLoading()"
        [type]="'button'"
        (onClick)="productForm.reset()"
      />
      
      <lib-button
        [label]="'Save Product'"
        [icon]="'pi pi-check'"
        [severity]="'success'"
        [loading]="isLoading()"
        [disabled]="!username() || !email() || !category()"
        [type]="'submit'"
      />
    </div>
  </form>

  <!-- Display selected values -->
  <div class="mt-8 p-4 bg-gray-100 rounded-lg">
    <h3 class="font-bold mb-3">Current Values:</h3>
    <div class="space-y-2 text-sm">
      <p><strong>Username:</strong> {{ username() || 'Not set' }}</p>
      <p><strong>Email:</strong> {{ email() || 'Not set' }}</p>
      <p><strong>Category:</strong> {{ category() || 'Not selected' }}</p>
      <p><strong>Tags:</strong> {{ tags().length > 0 ? tags().join(', ') : 'None selected' }}</p>
    </div>
  </div>
</div>
```

### 3. Advanced Examples

#### Custom Item Templates

```html
<!-- Dropdown with custom template -->
<lib-dropdown
  [(value)]="selectedUser"
  [options]="users()"
  [optionLabel]="'name'"
  [optionValue]="'id'"
  [filter]="true"
  [itemTemplate]="userItemTemplate"
  [selectedItemTemplate]="selectedUserTemplate"
/>

<ng-template #userItemTemplate let-user>
  <div class="flex items-center gap-3">
    <img [src]="user.avatar" class="w-8 h-8 rounded-full" />
    <div>
      <div class="font-semibold">{{ user.name }}</div>
      <div class="text-sm text-gray-500">{{ user.email }}</div>
    </div>
  </div>
</ng-template>

<ng-template #selectedUserTemplate let-user>
  <div class="flex items-center gap-2">
    <img [src]="user.avatar" class="w-6 h-6 rounded-full" />
    <span>{{ user.name }}</span>
  </div>
</ng-template>
```

#### Icon-Only Button

```html
<lib-button
  [icon]="'pi pi-trash'"
  [severity]="'danger'"
  [rounded]="true"
  [text]="true"
  [ariaLabel]="'Delete item'"
  (onClick)="handleDelete()"
/>
```

#### Password Input

```html
<lib-input-text
  [(value)]="password"
  [type]="'password'"
  [placeholder]="'Enter password'"
  [maxlength]="50"
  [fluid]="true"
/>
```

#### Grouped MultiSelect

```typescript
groupedOptions = signal([
  {
    label: 'Frontend',
    items: [
      { name: 'Angular', code: 'ng' },
      { name: 'React', code: 'react' },
      { name: 'Vue', code: 'vue' },
    ]
  },
  {
    label: 'Backend',
    items: [
      { name: 'Node.js', code: 'node' },
      { name: 'Python', code: 'python' },
      { name: 'Java', code: 'java' },
    ]
  }
]);
```

```html
<lib-multi-select
  [(value)]="selectedTechnologies"
  [options]="groupedOptions()"
  [optionLabel]="'name'"
  [optionValue]="'code'"
  [group]="true"
  [optionGroupLabel]="'label'"
  [optionGroupChildren]="'items'"
  [placeholder]="'Select technologies'"
/>
```

### 4. Using in Forms

#### Template-Driven Form

```html
<form #myForm="ngForm" (ngSubmit)="onSubmit()">
  <lib-input-text
    [(ngModel)]="formData.name"
    name="name"
    required
    minlength="3"
    #nameControl="ngModel"
    [invalid]="nameControl.invalid && nameControl.touched"
  />
  
  <lib-dropdown
    [(ngModel)]="formData.category"
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

#### Reactive Form

```typescript
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

productForm = new FormGroup({
  name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  category: new FormControl<string | null>(null, [Validators.required]),
  tags: new FormControl<string[]>([])
});
```

```html
<form [formGroup]="productForm" (ngSubmit)="onSubmit()">
  <lib-input-text
    formControlName="name"
    [placeholder]="'Product name'"
    [invalid]="productForm.controls.name.invalid && productForm.controls.name.touched"
  />
  
  <lib-dropdown
    formControlName="category"
    [options]="categories()"
    [invalid]="productForm.controls.category.invalid && productForm.controls.category.touched"
  />
  
  <lib-multi-select
    formControlName="tags"
    [options]="availableTags()"
  />
  
  <lib-button
    [label]="'Submit'"
    [type]="'submit'"
    [disabled]="productForm.invalid"
  />
</form>
```

---

## Important Notes

1. **Always import FormsModule** if you're using `[(ngModel)]` or template-driven forms
2. **Import ReactiveFormsModule** if you're using reactive forms with `formControlName`
3. All components work with **Angular Signals** for better performance
4. Components implement **ControlValueAccessor** so they work seamlessly with Angular forms
5. Use **two-way binding** with `[(value)]` or `[(ngModel)]`
6. All components support **Tailwind CSS** classes via the component wrapper

---

## Building Your App with the UI Library

```bash
# Build the library first (if changes were made)
npx nx build ui

# Build your app
npx nx build auctions-fe

# Serve with the library
npx nx serve auctions-fe
```

The library is automatically available to all apps in the monorepo via the `@auctions-fe/ui` import path.

