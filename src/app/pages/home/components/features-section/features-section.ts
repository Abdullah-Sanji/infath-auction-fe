import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { Feature } from './features-section.interface';

@Component({
  selector: 'app-features-section',
  imports: [CommonModule, TranslocoModule],
  templateUrl: './features-section.html',
  styleUrl: './features-section.scss'
})
export class FeaturesSection {
  features = signal<Feature[]>([
    {
      titleKey: 'home.features.unifiedPlatform.title',
      descriptionKey: 'home.features.unifiedPlatform.description',
      icon: 'pi pi-check-circle'
    },
    {
      titleKey: 'home.features.transparency.title',
      descriptionKey: 'home.features.transparency.description',
      icon: 'pi pi-check-circle'
    },
    {
      titleKey: 'home.features.financing.title',
      descriptionKey: 'home.features.financing.description',
      icon: 'pi pi-check-circle'
    },
    {
      titleKey: 'home.features.securePayment.title',
      descriptionKey: 'home.features.securePayment.description',
      icon: 'pi pi-check-circle'
    }
  ]);
}
