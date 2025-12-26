import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';

export type Language = 'en' | 'ar';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translocoService = inject(TranslocoService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private readonly LANGUAGE_KEY = 'preferred_language';

  // Available languages
  readonly languages: LanguageOption[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      dir: 'ltr'
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      dir: 'rtl'
    }
  ];

  // Current language signal
  currentLanguage = signal<Language>(this.getInitialLanguage());

  // Current language details
  currentLanguageDetails = computed(() => {
    const lang = this.currentLanguage();
    return this.languages.find(l => l.code === lang) || this.languages[0];
  });

  // Text direction
  textDirection = computed(() => this.currentLanguageDetails().dir);

  // Is RTL
  isRTL = computed(() => this.textDirection() === 'rtl');

  constructor() {
    // Set initial language in Transloco
    this.translocoService.setActiveLang(this.currentLanguage());

    // Apply direction to document if in browser
    if (this.isBrowser) {
      this.applyDirection();
    }
  }

  /**
   * Get initial language from cookie or browser preference
   */
  private getInitialLanguage(): Language {
    if (!this.isBrowser) {
      return 'en'; // Default for SSR
    }

    // Try to get from cookie
    const savedLang = this.getLanguageFromCookie();
    if (savedLang) {
      return savedLang;
    }

    // Try to get from browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'ar') {
      return 'ar';
    }

    return 'en';
  }

  /**
   * Get language from cookie
   */
  private getLanguageFromCookie(): Language | null {
    if (!this.isBrowser) return null;

    const cookies = document.cookie.split(';');
    const langCookie = cookies.find(c => c.trim().startsWith(`${this.LANGUAGE_KEY}=`));

    if (langCookie) {
      const lang = langCookie.split('=')[1] as Language;
      if (lang === 'en' || lang === 'ar') {
        return lang;
      }
    }

    return null;
  }

  /**
   * Save language to cookie
   */
  private saveLanguageToCookie(lang: Language): void {
    if (!this.isBrowser) return;

    // Set cookie for 1 year
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    document.cookie = `${this.LANGUAGE_KEY}=${lang}; path=/; expires=${expires.toUTCString()}; SameSite=Strict`;
  }

  /**
   * Apply text direction to document
   */
  private applyDirection(): void {
    if (!this.isBrowser) return;

    const dir = this.textDirection();
    document.documentElement.dir = dir;
    document.documentElement.lang = this.currentLanguage();
  }

  /**
   * Switch to a different language
   */
  setLanguage(lang: Language): void {
    if (lang === this.currentLanguage()) {
      return; // Already active
    }

    // Update signal
    this.currentLanguage.set(lang);

    // Update Transloco
    this.translocoService.setActiveLang(lang);

    // Save to cookie
    this.saveLanguageToCookie(lang);

    // Apply direction
    if (this.isBrowser) {
      this.applyDirection();
    }
  }

  /**
   * Toggle between English and Arabic
   */
  toggleLanguage(): void {
    const newLang: Language = this.currentLanguage() === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }

  /**
   * Get language name by code
   */
  getLanguageName(code: Language): string {
    return this.languages.find(l => l.code === code)?.name || code;
  }

  /**
   * Get native language name by code
   */
  getNativeLanguageName(code: Language): string {
    return this.languages.find(l => l.code === code)?.nativeName || code;
  }
}

