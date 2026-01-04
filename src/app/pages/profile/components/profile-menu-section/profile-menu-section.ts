import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ProfileMenuSection, ProfileMenuItem } from '../../interfaces/profile.interface';

@Component({
  selector: 'app-profile-menu-section',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './profile-menu-section.html',
  styleUrl: './profile-menu-section.scss',
})
export class ProfileMenuSectionComponent {
  menuSection = input.required<ProfileMenuSection>();
  onMenuItemClick = output<{ itemId: string; route?: string }>();

  handleItemClick(item: ProfileMenuItem): void {
    this.onMenuItemClick.emit({
      itemId: item.id,
      route: item.route
    });
  }
}

