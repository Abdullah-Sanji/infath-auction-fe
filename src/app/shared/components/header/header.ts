import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { Button } from '../ui/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, TranslocoPipe, Button],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  protected authService = inject(AuthService);
  protected languageService = inject(LanguageService);
  protected router = inject(Router);
  protected walletBalance = signal<number>(10000);
  protected readonly isAuthenticated = this.authService.isAuthenticated;


  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  login(): void {
    this.router.navigateByUrl('/login');
  }
}

