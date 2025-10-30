import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Button } from '../../../../../../libs/ui/src/lib/button/button';
import { InputText } from '../../../../../../libs/ui/src/lib/input-text/input-text';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, Button, InputText, PasswordModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = signal('');
  password = signal('');
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  async onSubmit(): Promise<void> {
    this.errorMessage.set('');
    this.isLoading.set(true);

    try {
      const success = await this.authService.login(this.username(), this.password());

      if (success) {
        const redirectUrl = this.authService.getRedirectUrl();
        await this.router.navigate([redirectUrl]);
      } else {
        this.errorMessage.set(
          'Invalid username or password. Please check your credentials and try again.'
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage.set(
        'Unable to connect to the authentication service. Please try again later.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
