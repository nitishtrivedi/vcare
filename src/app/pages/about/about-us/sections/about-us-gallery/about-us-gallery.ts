import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

interface GalleryPhoto {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-about-us-gallery',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us-gallery.html',
  styleUrl: './about-us-gallery.scss',
})
export class AboutUsGallery {
  @ViewChild('track') trackRef!: ElementRef<HTMLDivElement>;

  //readonly items = Array.from({ length: 8 }, (_, i) => i + 1);
  readonly photos: GalleryPhoto[] = Array.from({ length: 8 }, (_, i) => ({
    src: `assets/images/about-us/gallery/gallery-${i + 1}.jpg`,
    alt: `V Care campus moment ${i + 1}`,
  }));

  // Tracks which tiles failed to load their real photo, so only those
  // fall back to the icon + "Gallery photo" placeholder overlay.
  readonly brokenImages = new Set<number>();

  onImageError(index: number): void {
    this.brokenImages.add(index);
  }
  scroll(direction: 1 | -1): void {
    const el = this.trackRef.nativeElement;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' });
  }
}
