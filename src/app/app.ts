import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { siteConfig } from './site-config';
import { UnderDevelopment } from './pages/under-development/under-development';
import { filter } from 'rxjs';
import { Seo } from './services/seo';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, UnderDevelopment],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  //protected readonly title = signal('vcare');
  readonly siteUnderDevelopment = siteConfig.siteUnderDevelopment;

  /**
   * True when the current route belongs
   * to the private administration area.
   */
  readonly isAdminArea = signal(false);

  constructor(
    private readonly router: Router,
    private readonly seoService: Seo,
  ) {
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
        this.updateSeo(navigation.urlAfterRedirects);
      });
  }
  private updateSeo(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0];

    if (cleanUrl.startsWith('/admin')) {
      this.seoService.update({
        title: 'VCare Admin',
        description: 'VCare Education administration area.',
        canonical: 'https://vcarepreschool.in/',
        robots: 'noindex, nofollow',
      });

      return;
    }

    const seoMap: Record<
      string,
      {
        title: string;
        description: string;
      }
    > = {
      '/': {
        title: 'Preschool in Pune | VCare Education, Karvenagar',
        description:
          'VCare Education is a preschool in Karvenagar, Pune offering playgroup, nursery, Junior KG, Senior KG, daycare, parent-toddler and after-school programs.',
      },

      '/about-us': {
        title: 'About VCare Education | Preschool in Pune',
        description:
          'Learn about VCare Education, our approach to early childhood learning, our team and our preschool campus in Karvenagar, Pune.',
      },

      '/about/zero-fee-model': {
        title: 'Zero Fee Model | VCare Education Pune',
        description:
          'Discover VCare Education’s Zero Fee Model and learn how children can progress from Playgroup to Senior KG with our unique education model.',
      },

      '/about/faq': {
        title: 'Preschool FAQ | VCare Education Pune',
        description:
          'Find answers about VCare Education, preschool admissions, programs, timings, daycare and our Zero Fee Model in Karvenagar, Pune.',
      },

      '/contact': {
        title: 'Contact VCare Preschool | Karvenagar, Pune',
        description:
          'Contact VCare Education in Karvenagar, Pune to enquire about preschool, daycare, parent-toddler and after-school programs or schedule a visit.',
      },

      '/gallery': {
        title: 'VCare Preschool Gallery | Karvenagar Pune',
        description:
          'Explore photographs and moments from VCare Education preschool and activity centre in Karvenagar, Pune.',
      },

      '/franchise': {
        title: 'VCare Preschool Franchise | Education Business Opportunity',
        description:
          'Explore the VCare Education preschool franchise opportunity and learn about our preschool, daycare and activity centre model.',
      },

      '/blog': {
        title: 'VCare Education Blog | Preschool & Parenting',
        description:
          'Read VCare Education articles about preschool learning, parenting, child development and early education.',
      },

      '/programs/preschool-program': {
        title: 'Preschool in Pune | Playgroup, Nursery & KG | VCare',
        description:
          'Explore VCare Education’s preschool program in Karvenagar, Pune, including Playgroup, Nursery, Junior KG and Senior KG.',
      },

      '/programs/daycare-program': {
        title: 'Daycare in Pune | VCare Education, Karvenagar',
        description:
          'VCare Daycare in Karvenagar, Pune provides a safe, caring and engaging environment for children from 6 months to 8 years.',
      },

      '/programs/after-school-program': {
        title: 'After School Program in Pune | VCare Education',
        description:
          'VCare’s After School Program in Karvenagar, Pune combines homework support, activities, play, creativity and life skills.',
      },

      '/programs/parent-toddler-program': {
        title: 'Parent Toddler Program in Pune | VCare Education',
        description:
          'VCare’s Parent Toddler Program in Karvenagar, Pune introduces young children to a preschool environment alongside a parent.',
      },
    };

    const config = seoMap[cleanUrl];

    if (!config) {
      return;
    }

    this.seoService.update({
      ...config,
      canonical: `https://vcarepreschool.in${cleanUrl}`,
    });
  }
  private isAdminUrl(url: string): boolean {
    return url === '/admin' || url.startsWith('/admin/');
  }
}
