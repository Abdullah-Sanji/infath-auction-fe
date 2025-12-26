# Transloco i18n Integration Guide

## Overview

This project uses **Transloco** for internationalization (i18n) with support for:
- ✅ English (en) - LTR
- ✅ Arabic (ar) - RTL
- ✅ Runtime language switching
- ✅ SSR compatible
- ✅ Signals-based language service

---

## Quick Start

### 1. Using Translations in Templates

```html
<!-- Simple translation -->
<h1>{{ 'common.welcome' | transloco }}</h1>

<!-- Nested keys -->
<p>{{ 'login.title' | transloco }}</p>

<!-- With parameters -->
<p>{{ 'errors.minLength' | transloco: { min: 6 } }}</p>
```

### 2. Using Translations in Components

```typescript
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export class MyComponent {
  private translocoService = inject(TranslocoService);

  showMessage(): void {
    const message = this.translocoService.translate('common.success');
    console.log(message);
  }

  // With parameters
  showError(min: number): void {
    const error = this.translocoService.translate('errors.minLength', { min });
    console.log(error);
  }
}
```

### 3. Language Switching

```typescript
import { inject } from '@angular/core';
import { LanguageService } from './core/services/language.service';

export class MyComponent {
  protected languageService = inject(LanguageService);

  // Switch to specific language
  switchToArabic(): void {
    this.languageService.setLanguage('ar');
  }

  // Toggle between English and Arabic
  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  // Get current language
  getCurrentLang(): string {
    return this.languageService.currentLanguage();
  }

  // Check if RTL
  isRightToLeft(): boolean {
    return this.languageService.isRTL();
  }
}
```

---

## Translation Files Structure

Translation files are located in `src/assets/i18n/`:

```
src/assets/i18n/
├── en.json    # English translations
└── ar.json    # Arabic translations
```

### File Format

```json
{
  "common": {
    "welcome": "Welcome",
    "loading": "Loading...",
    "save": "Save"
  },
  "login": {
    "title": "Login",
    "email": "Email Address"
  },
  "errors": {
    "required": "This field is required",
    "minLength": "Minimum length is {{min}} characters"
  }
}
```

### Adding New Translations

1. Add the key to both `en.json` and `ar.json`
2. Use nested objects for organization
3. Use `{{parameter}}` syntax for dynamic values

**Example:**

```json
// en.json
{
  "auctions": {
    "bidPlaced": "Bid of ${{amount}} placed successfully"
  }
}

// ar.json
{
  "auctions": {
    "bidPlaced": "تم تقديم عرض بقيمة ${{amount}} بنجاح"
  }
}
```

**Usage:**

```html
<p>{{ 'auctions.bidPlaced' | transloco: { amount: 100 } }}</p>
```

---

## Language Service API

### Properties (Signals)

```typescript
// Current language code ('en' | 'ar')
languageService.currentLanguage()

// Current language details
languageService.currentLanguageDetails()
// Returns: { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' }

// Text direction ('ltr' | 'rtl')
languageService.textDirection()

// Is right-to-left
languageService.isRTL()
```

### Methods

```typescript
// Set language
languageService.setLanguage('ar')

// Toggle between English and Arabic
languageService.toggleLanguage()

// Get language name
languageService.getLanguageName('ar')  // Returns: 'Arabic'

// Get native language name
languageService.getNativeLanguageName('ar')  // Returns: 'العربية'
```

---

## Component Examples

### Example 1: Language Switcher Button

```typescript
// component.ts
import { Component, inject } from '@angular/core';
import { LanguageService } from './core/services/language.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-language-switcher',
  imports: [ButtonModule],
  template: `
    <p-button
      [label]="languageService.currentLanguage() === 'en' ? 'العربية' : 'English'"
      icon="pi pi-globe"
      (onClick)="languageService.toggleLanguage()"
    />
  `
})
export class LanguageSwitcher {
  protected languageService = inject(LanguageService);
}
```

### Example 2: Translated Form

```html
<form #loginForm="ngForm" (ngSubmit)="onSubmit()">
  <h2>{{ 'login.title' | transloco }}</h2>

  <label>{{ 'login.email' | transloco }}</label>
  <input
    type="email"
    name="email"
    [(ngModel)]="email"
    [placeholder]="'login.email' | transloco"
    required
  />

  <label>{{ 'login.password' | transloco }}</label>
  <input
    type="password"
    name="password"
    [(ngModel)]="password"
    [placeholder]="'login.password' | transloco"
    required
  />

  <button type="submit">
    {{ 'login.signIn' | transloco }}
  </button>
</form>
```

### Example 3: Dynamic Error Messages

```typescript
// component.ts
import { Component, signal, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-form',
  template: `
    @if (error()) {
      <p-message severity="error" [text]="error()!" />
    }
  `
})
export class FormComponent {
  private translocoService = inject(TranslocoService);
  error = signal<string | null>(null);

  validateField(value: string, minLength: number): void {
    if (value.length < minLength) {
      this.error.set(
        this.translocoService.translate('errors.minLength', { min: minLength })
      );
    } else {
      this.error.set(null);
    }
  }
}
```

---

## RTL Support

The `LanguageService` automatically handles RTL/LTR direction:

### Automatic Direction Setting

When language changes, the service automatically:
1. Sets `document.documentElement.dir` to `'rtl'` or `'ltr'`
2. Sets `document.documentElement.lang` to `'ar'` or `'en'`

### Using Direction in Components

```typescript
export class MyComponent {
  protected languageService = inject(LanguageService);

  // Use in template
  template: `
    <div [class.rtl]="languageService.isRTL()">
      Content
    </div>
  `
}
```

### CSS for RTL

```scss
// Tailwind automatically handles RTL with dir="rtl"
// For custom styles:

[dir="rtl"] {
  .my-element {
    text-align: right;
    margin-left: 0;
    margin-right: 1rem;
  }
}

[dir="ltr"] {
  .my-element {
    text-align: left;
    margin-right: 0;
    margin-left: 1rem;
  }
}
```

---

## SSR Considerations

### Language Detection

The `LanguageService` handles SSR properly:

1. **Server-side**: Defaults to English
2. **Client-side**: Checks cookie → browser language → defaults to English

### Cookie Storage

Language preference is stored in a cookie (not localStorage) for SSR compatibility:

```typescript
// Cookie name: 'preferred_language'
// Expires: 1 year
// Path: /
// SameSite: Strict
```

---

## Best Practices

### 1. Organize Translation Keys

Use nested objects for better organization:

```json
{
  "module": {
    "feature": {
      "action": "Text"
    }
  }
}
```

### 2. Consistent Naming

- Use lowercase with underscores: `user_profile`
- Use descriptive names: `login.emailPlaceholder` not `login.ep`
- Group by feature/page

### 3. Avoid Hardcoded Text

❌ **Bad:**
```html
<button>Submit</button>
```

✅ **Good:**
```html
<button>{{ 'common.submit' | transloco }}</button>
```

### 4. Use Parameters for Dynamic Content

❌ **Bad:**
```typescript
const message = `Welcome ${userName}`;
```

✅ **Good:**
```json
{
  "welcome": "Welcome {{name}}"
}
```

```typescript
const message = this.translocoService.translate('welcome', { name: userName });
```

### 5. Provide Fallbacks

Always provide fallback text for missing translations:

```typescript
const text = this.translocoService.translate('key') || 'Default text';
```

---

## Testing

### Testing Components with Transloco

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoModule } from '@jsverse/transloco';
import { getTranslocoModule } from './transloco-testing.module';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MyComponent,
        getTranslocoModule()  // Test module with mock translations
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should display translated text', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('Welcome');
  });
});
```

---

## Troubleshooting

### Translation Not Showing

1. Check if the key exists in both `en.json` and `ar.json`
2. Verify the translation files are in `src/assets/i18n/`
3. Check `angular.json` includes the assets configuration
4. Clear browser cache and rebuild

### RTL Not Working

1. Verify `LanguageService` is injected
2. Check browser DevTools: `document.documentElement.dir` should be `'rtl'`
3. Ensure Tailwind CSS is properly configured for RTL

### Language Not Persisting

1. Check browser cookies: Look for `preferred_language`
2. Verify cookie is not being blocked
3. Check if running in SSR mode (cookies work differently)

---

## Adding a New Language

To add a new language (e.g., French):

1. **Create translation file:**
   ```bash
   touch src/assets/i18n/fr.json
   ```

2. **Add translations:**
   ```json
   {
     "common": {
       "welcome": "Bienvenue"
     }
   }
   ```

3. **Update `app.config.ts`:**
   ```typescript
   provideTransloco({
     config: {
       availableLangs: ['en', 'ar', 'fr'],  // Add 'fr'
       defaultLang: 'en',
       // ...
     }
   })
   ```

4. **Update `LanguageService`:**
   ```typescript
   readonly languages: LanguageOption[] = [
     { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
     { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
     { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr' }
   ];
   ```

---

## Resources

- [Transloco Documentation](https://jsverse.github.io/transloco/)
- [Angular i18n Guide](https://angular.dev/guide/i18n)
- [RTL Styling Guide](https://rtlstyling.com/)

---

**Last Updated**: 2025-12-25  
**Maintained By**: Development Team

