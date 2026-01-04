import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4 text-right">
        {{ 'profile.menu.favorites' | transloco }}
      </h2>
      <p class="text-gray-600 text-right">
        {{ 'profile.menu.favoritesDesc' | transloco }}
      </p>
      <!-- TODO: Implement favorites list -->
    </div>
  `,
})
export class Favorites {}

