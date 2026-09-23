import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ScrollReveal } from '../../directives/scroll-reveal';

export interface GalleryImage {
  index: number;
  src: string;
  alt: string;
  category: string;
  colSpan: number;
  rowSpan: number;
  caption?: string;
  tag?: string;
}

interface ManifestEntry {
  src: string;
  category?: string;
  caption?: string;
  tag?: string;
  colSpan?: number;
  rowSpan?: number;
}

/**
 * Optional per-photo overrides, keyed by the number in the filename
 * (gallery-image-3.jpg → key 3). Nothing here is required — any photo
 * without an entry just gets sensible auto-generated defaults, so you
 * can upload 5 photos or 500 and it all just works.
 *
 * Fill this in only for photos you want to specifically caption / tag /
 * resize. Everything else is left to the auto pattern.
 */
// const IMAGE_META: Record<
//   number,
//   Partial<Pick<GalleryImage, 'category' | 'caption' | 'tag' | 'colSpan' | 'rowSpan'>>
// > = {
//   1: {
//     category: 'Classroom',
//     caption: 'Hands-on exploration, every single day.',
//     tag: 'Featured',
//     colSpan: 2,
//     rowSpan: 2,
//   },
//   // 2: { category: 'Outdoor Play', caption: 'Free play in the sun.' },
//   // 3: { category: 'Events', tag: 'New', colSpan: 2, rowSpan: 1 },
// };

// A rotating bento pattern so photos without an explicit size in
// IMAGE_META still lay out with nice visual variety at any scale.
const SIZE_PATTERN: Array<Pick<GalleryImage, 'colSpan' | 'rowSpan'>> = [
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 2, rowSpan: 1 },
  { colSpan: 1, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 2, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 2 },
  { colSpan: 2, rowSpan: 1 },
];

const DEFAULT_CATEGORY = 'V Care Moments';
@Component({
  selector: 'app-gallery',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements OnInit, OnDestroy {
  // ============================================================
  // 🎛️  IMAGE SOURCE
  // Add or remove photos by editing the manifest file below —
  // no code changes needed, and no guessed/blind network
  // requests (that's what caused the 404 console spam before).
  //
  //   public/assets/images/gallery/manifest.json
  //   public/assets/images/gallery/<any-filename>.jpg
  //
  // manifest.json looks like:
  //   [
  //     { "src": "gallery-1.jpg", "category": "Classroom", "caption": "...", "tag": "Featured", "colSpan": 2, "rowSpan": 2 },
  //     { "src": "gallery-2.jpg" },
  //     { "src": "gallery-3.jpg", "category": "Outdoor Play" }
  //   ]
  //
  // Only "src" is required — everything else is optional and falls
  // back to sensible defaults.
  // ============================================================
  private readonly FOLDER = 'assets/images/gallery/';
  private readonly MANIFEST_URL = `${this.FOLDER}manifest.json`;

  private destroyed = false;

  readonly images = signal<GalleryImage[]>([]);
  readonly isScanning = signal(true);

  readonly categories = computed(() => {
    const set = new Set(this.images().map((img) => img.category));
    return ['All', ...Array.from(set)];
  });

  readonly activeCategory = signal('All');

  readonly filteredImages = computed(() => {
    const active = this.activeCategory();
    const all = this.images();
    return active === 'All' ? all : all.filter((img) => img.category === active);
  });

  setCategory(category: string): void {
    this.activeCategory.set(category);
  }

  // ---------------- LIFECYCLE ----------------

  ngOnInit(): void {
    this.loadManifest();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.classList.remove('lightbox-open');
    }
  }

  // ---------------- MANIFEST LOADING ----------------

  private async loadManifest(): Promise<void> {
    try {
      const response = await fetch(this.MANIFEST_URL);

      if (!response.ok) {
        // No manifest yet — treat as "nothing uploaded", not an error.
        if (!this.destroyed) this.isScanning.set(false);
        return;
      }

      const entries = (await response.json()) as ManifestEntry[];

      const list: GalleryImage[] = entries.map((entry, i) => this.buildImage(i + 1, entry));

      if (!this.destroyed) {
        this.images.set(list);
      }
    } catch {
      // Manifest missing or malformed — fall back to empty state quietly.
    } finally {
      if (!this.destroyed) {
        this.isScanning.set(false);
      }
    }
  }

  private buildImage(index: number, entry: ManifestEntry): GalleryImage {
    const pattern = SIZE_PATTERN[(index - 1) % SIZE_PATTERN.length];

    return {
      index,
      src: `${this.FOLDER}${entry.src}`,
      alt: entry.caption ?? `V Care Education gallery photo ${index}`,
      category: entry.category ?? DEFAULT_CATEGORY,
      caption: entry.caption,
      tag: entry.tag,
      colSpan: entry.colSpan ?? pattern.colSpan,
      rowSpan: entry.rowSpan ?? pattern.rowSpan,
    };
  }

  /**
   * If a manifest entry points at a file that's missing or was moved,
   * drop just that tile instead of leaving a broken image in the grid.
   */
  onImageError(index: number): void {
    this.images.update((current) => current.filter((img) => img.index !== index));
  }

  // ---------------- LIGHTBOX ----------------

  readonly lightboxIndex = signal<number | null>(null);

  readonly lightboxImage = computed(() => {
    const idx = this.lightboxIndex();
    const list = this.filteredImages();
    return idx === null ? null : (list[idx] ?? null);
  });

  openLightbox(index: number): void {
    this.lightboxIndex.set(index);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('lightbox-open');
    }
  }

  closeLightbox(): void {
    this.lightboxIndex.set(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.classList.remove('lightbox-open');
    }
  }

  next(event?: Event): void {
    event?.stopPropagation();
    const total = this.filteredImages().length;
    const idx = this.lightboxIndex();
    if (idx === null || total === 0) return;
    this.lightboxIndex.set((idx + 1) % total);
  }

  prev(event?: Event): void {
    event?.stopPropagation();
    const total = this.filteredImages().length;
    const idx = this.lightboxIndex();
    if (idx === null || total === 0) return;
    this.lightboxIndex.set((idx - 1 + total) % total);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.lightboxIndex() === null) return;
    if (event.key === 'Escape') this.closeLightbox();
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.prev();
  }

  trackByIndex(_: number, img: GalleryImage): number {
    return img.index;
  }
}
