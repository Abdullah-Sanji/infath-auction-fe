import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Toast } from 'primeng/toast';
import { Header } from './shared/components/header/header';
import { GtmService } from './core/services/gtm.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private gtmService = inject(GtmService);
  private router = inject(Router);

  protected readonly title = signal('auctions-fe');

  ngOnInit(): void {
    // Initialize GTM
    this.gtmService.initialize();

    // Track page views on route changes
    /* this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.gtmService.pushPageView(event.urlAfterRedirects, document?.title);
      }); */
  }
}
