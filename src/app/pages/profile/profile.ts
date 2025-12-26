import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { UserProfile } from '@shared/models/auth.models';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  protected readonly profile = signal<UserProfile | null>(null);

  protected get user() {
    return this.profile();
  }
}
