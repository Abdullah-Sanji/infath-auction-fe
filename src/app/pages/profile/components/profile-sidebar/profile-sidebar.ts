import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ProfileMenuSectionComponent } from '../profile-menu-section/profile-menu-section';
import { UserProfile, ProfileMenuSection } from '../../interfaces/profile.interface';

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    ProfileMenuSectionComponent
  ],
  templateUrl: './profile-sidebar.html',
  styleUrl: './profile-sidebar.scss',
})
export class ProfileSidebar {
  profile = input.required<UserProfile | null>();
  accountMenuItems = input.required<ProfileMenuSection>();
  preferencesMenuItems = input.required<ProfileMenuSection>();
  
  onMenuItemClick = output<{ itemId: string; route?: string }>();
  onSignOut = output<void>();

  // Image error state
  imageError = signal(false);

  // Computed
  userInitials = computed(() => {
    const prof = this.profile();
    if (!prof) return '';
    return `${prof.firstName.charAt(0)}${prof.lastName.charAt(0)}`.toUpperCase();
  });

  fullName = computed(() => {
    const prof = this.profile();
    if (!prof) return '';
    return `${prof.firstName} ${prof.lastName}`;
  });

  shouldShowAvatar = computed(() => {
    const prof = this.profile();
    return prof?.avatarUrl && !this.imageError();
  });

  handleMenuItemClick(event: { itemId: string; route?: string }): void {
    this.onMenuItemClick.emit(event);
  }

  handleSignOut(): void {
    this.onSignOut.emit();
  }

  onImageError(): void {
    this.imageError.set(true);
  }
}

