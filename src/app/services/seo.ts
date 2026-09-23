import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  type?: string;
  robots?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Seo {
  private readonly siteUrl = 'https://vcarepreschool.in';
  private readonly defaultImage = `${this.siteUrl}/assets/images/homepage/vcare-hero-image.png`;

  constructor(
    private readonly titleService: Title,
    private readonly metaService: Meta,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  update(config: SeoConfig): void {
    const image = config.image ?? this.defaultImage;
    const type = config.type ?? 'website';
    const robots = config.robots ?? 'index, follow';

    this.titleService.setTitle(config.title);

    this.metaService.updateTag({
      name: 'description',
      content: config.description,
    });

    this.metaService.updateTag({
      name: 'robots',
      content: robots,
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: config.title,
    });

    this.metaService.updateTag({
      property: 'og:description',
      content: config.description,
    });

    this.metaService.updateTag({
      property: 'og:url',
      content: config.canonical,
    });

    this.metaService.updateTag({
      property: 'og:type',
      content: type,
    });

    this.metaService.updateTag({
      property: 'og:image',
      content: image,
    });

    this.metaService.updateTag({
      property: 'og:site_name',
      content: 'VCare Education',
    });

    this.metaService.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });

    this.metaService.updateTag({
      name: 'twitter:title',
      content: config.title,
    });

    this.metaService.updateTag({
      name: 'twitter:description',
      content: config.description,
    });

    this.metaService.updateTag({
      name: 'twitter:image',
      content: image,
    });

    this.setCanonical(config.canonical);
  }

  setCanonical(url: string): void {
    let link = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  setJsonLd(data: unknown, id = 'vcare-jsonld'): void {
    let script = this.document.getElementById(id) as HTMLScriptElement | null;

    if (!script) {
      script = this.document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);
  }
}
