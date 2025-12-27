import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { Header } from './shared/components/header/header';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Header, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private languageService = inject(LanguageService);

  protected readonly title = signal('auctions-fe');

  ngOnInit(): void {
    // Ensure language is set immediately on app initialization
    // This prevents the flash of wrong language content
    const initialLang = this.languageService.currentLanguage();
    this.languageService.setLanguage(initialLang);
  }
}
