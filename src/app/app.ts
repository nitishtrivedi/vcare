import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { siteConfig } from './site-config';
import { UnderDevelopment } from './pages/under-development/under-development';
import { filter } from 'rxjs';
import { ScrollToTop } from './components/scroll-to-top/scroll-to-top';
import { UnderMaintenance } from './pages/under-maintenance/under-maintenance';
import { SiteInauguration } from './components/site-inauguration/site-inauguration';

const INAUGURATION_SEEN_KEY = 'vcare-inauguration-seen';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    Footer,
    UnderDevelopment,
    ScrollToTop,
    UnderMaintenance,
    SiteInauguration,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  //protected readonly title = signal('vcare');
  readonly siteUnderDevelopment = siteConfig.siteUnderDevelopment;
  readonly siteUnderMaintenance = siteConfig.siteUnderMaintenance;

  /**
   * True when the current route belongs
   * to the private administration area.
   */
  readonly isAdminArea = signal(false);
  readonly showInauguration = signal(this.shouldShowInauguration());

  constructor(private readonly router: Router) {
    /*
     * Set the initial value immediately.
     *
     * This prevents the public navbar/footer
     * from appearing when the browser directly
     * opens /admin or /admin/login.
     */
    this.isAdminArea.set(this.isAdminUrl(this.router.url));

    /*
     * Keep the shell synchronized whenever
     * Angular changes routes.
     */
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navigation = event as NavigationEnd;

        this.isAdminArea.set(this.isAdminUrl(navigation.urlAfterRedirects));
      });
  }
  onInaugurationFinished(): void {
    this.showInauguration.set(false);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(INAUGURATION_SEEN_KEY, '1');
    }
  }

  private shouldShowInauguration(): boolean {
    if (!siteConfig.showInaugurationAnimation || typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(INAUGURATION_SEEN_KEY) !== '1';
  }
  private isAdminUrl(url: string): boolean {
    return url === '/admin' || url.startsWith('/admin/');
  }
}
