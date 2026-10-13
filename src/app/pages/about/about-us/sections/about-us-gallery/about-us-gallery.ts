import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { GsapReveal } from '../../../../../directives/gsap-reveal';
import { gsap, prefersReducedMotion, registerGsap } from '../../../../../shared/motion/gsap-setup';

interface GalleryPhoto {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-about-us-gallery',
  imports: [GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us-gallery.html',
  styleUrl: './about-us-gallery.scss',
})
export class AboutUsGallery implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;
  @ViewChild('track', { static: true }) private trackRef!: ElementRef<HTMLDivElement>;
  private ctx?: gsap.Context;

  readonly photos: GalleryPhoto[] = Array.from({ length: 8 }, (_, i) => ({
    src: `assets/images/about-us/gallery/gallery-${i + 1}.jpg`,
    alt: `V Care campus moment ${i + 1}`,
  }));

  readonly failed = signal<ReadonlySet<number>>(new Set());
  readonly progress = signal(0);

  constructor() {
    registerGsap();
  }

  markFailed(index: number): void {
    this.failed.update((set) => new Set(set).add(index));
  }

  onScroll(): void {
    const el = this.trackRef.nativeElement;
    const max = el.scrollWidth - el.clientWidth;
    this.progress.set(max > 0 ? el.scrollLeft / max : 0);
  }

  scroll(direction: 1 | -1): void {
    const el = this.trackRef.nativeElement;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;

    this.ctx = gsap.context(() => {
      gsap.from('[data-tile]', {
        autoAlpha: 0,
        x: 60,
        rotate: 3,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-tile-track]', start: 'top 85%' },
      });

      gsap.to('.ab-gal__blob', {
        x: 60,
        y: -30,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
