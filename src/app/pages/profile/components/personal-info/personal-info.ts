import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';

// Components
import { Button } from '@shared/components/ui/button/button';
import { InputText } from '@shared/components/ui/input-text/input-text';

// PrimeNG Imports
import { MessageModule } from 'primeng/message';

// Services
import { ProfileService } from '../../services/profile.service';

// Interfaces
import { UserProfile } from '../../interfaces/profile.interface';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule, Button, InputText, MessageModule],
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.scss',
})
export class PersonalInfo {
  private profileService = inject(ProfileService);

  // State
  profile = signal<UserProfile | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  imageError = signal(false);

  // Form Data
  firstName = signal('');
  lastName = signal('');
  email = signal('');
  phoneNumber = signal('');
  phoneCountryCode = signal('+962');

  // Computed
  userInitials = computed(() => {
    const prof = this.profile();
    if (!prof) return '';
    return `${prof.firstName.charAt(0)}${prof.lastName.charAt(0)}`.toUpperCase();
  });

  shouldShowAvatar = computed(() => {
    const prof = this.profile();
    return prof?.avatarUrl && !this.imageError();
  });

  fullName = computed(() => {
    const prof = this.profile();
    if (!prof) return '';
    return `${prof.firstName} ${prof.lastName}`;
  });

  hasChanges = computed(() => {
    const prof = this.profile();
    if (!prof) return false;

    return (
      this.firstName() !== prof.firstName ||
      this.lastName() !== prof.lastName ||
      this.email() !== prof.email ||
      this.phoneNumber() !== prof.phoneNumber
    );
  });

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      // Mock API response data
      const mockProfile: UserProfile = {
        id: '1',
        firstName: 'أحمد',
        lastName: 'محمد',
        email: 'ahmed.mohammed@example.com',
        phoneNumber: '791234567',
        phoneCountryCode: '+962',
        avatarUrl: 'https://via.placeholder.com/150',
        bidsCount: 12,
        favoritesCount: 5
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      this.profile.set(mockProfile);
      this.populateForm(mockProfile);
      this.imageError.set(false); // Reset image error when loading new profile
    } catch (error) {
      console.error('Failed to load profile:', error);
      this.error.set('profile.errors.loadFailed');
    } finally {
      this.isLoading.set(false);
    }
  }

  private populateForm(profile: UserProfile): void {
    this.firstName.set(profile.firstName);
    this.lastName.set(profile.lastName);
    this.email.set(profile.email);
    this.phoneNumber.set(profile.phoneNumber);
    this.phoneCountryCode.set(profile.phoneCountryCode);
  }

  async onSaveChanges(): Promise<void> {
    if (!this.hasChanges()) {
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    try {
      const updateData = {
        firstName: this.firstName(),
        lastName: this.lastName(),
        email: this.email(),
        phoneNumber: this.phoneNumber(),
      };

      this.successMessage.set('profile.success.updateSuccess');
      await this.loadProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      this.error.set('profile.errors.updateFailed');
    } finally {
      this.isSaving.set(false);
    }
  }

  onCancelChanges(): void {
    const prof = this.profile();
    if (prof) {
      this.populateForm(prof);
    }
    this.successMessage.set(null);
    this.error.set(null);
  }

  async onUploadImage(): Promise<void> {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        await this.uploadAvatar(file);
      }
    };

    input.click();
  }

  private async uploadAvatar(file: File): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      this.successMessage.set('profile.success.avatarUploaded');
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      this.error.set('profile.errors.uploadFailed');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onDeleteImage(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      this.successMessage.set('profile.success.avatarDeleted');
      // Clear avatar URL and reset image error
      const prof = this.profile();
      if (prof) {
        this.profile.set({ ...prof, avatarUrl: undefined });
        this.imageError.set(false);
      }
    } catch (error) {
      console.error('Failed to delete avatar:', error);
      this.error.set('profile.errors.deleteFailed');
    } finally {
      this.isLoading.set(false);
    }
  }

  onImageError(): void {
    this.imageError.set(true);
  }
}
