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

/**
 * Optional per-photo overrides, keyed by the number in the filename
 * (gallery-image-3.jpg → key 3). Nothing here is required — any photo
 * without an entry just gets sensible auto-generated defaults, so you
 * can upload 5 photos or 500 and it all just works.
 *
 * Fill this in only for photos you want to specifically caption / tag /
 * resize. Everything else is left to the auto pattern.
 */
const IMAGE_META: Record<
  number,
  Partial<Pick<GalleryImage, 'category' | 'caption' | 'tag' | 'colSpan' | 'rowSpan'>>
> = {
  1: {
    category: 'Classroom',
    caption: 'Hands-on exploration, every single day.',
    tag: 'Featured',
    colSpan: 2,
    rowSpan: 2,
  },
  // 2: { category: 'Outdoor Play', caption: 'Free play in the sun.' },
  // 3: { category: 'Events', tag: 'New', colSpan: 2, rowSpan: 1 },
};

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
  // 🎛️  SCAN CONFIG — tweak if you ever change the naming scheme
  // ============================================================
  private readonly FOLDER = 'assets/images/gallery/';
  private readonly FILE_PREFIX = 'gallery-image-';
  private readonly EXTENSIONS = ['jpg', 'JPG', 'jpeg', 'png', 'webp'];

  /** How many indices to probe at once. */
  private readonly BATCH_SIZE = 15;
  /** Stop scanning after this many consecutive fully-empty batches
   *  (tolerates small gaps in numbering without giving up too early). */
  private readonly MAX_EMPTY_BATCHES = 2;
  /** Absolute safety ceiling so a runaway scan can never loop forever. */
  private readonly MAX_INDEX = 3000;

  private destroyed = false;

  // ---------------- STATE ----------------

  readonly images = signal<GalleryImage[]>([]);
  readonly isScanning = signal(true);
  readonly scannedCount = signal(0);

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
    this.scan();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  // ---------------- AUTO-DISCOVERY ----------------

  private async scan(): Promise<void> {
    const found: GalleryImage[] = [];
    let index = 1;
    let emptyBatches = 0;

    while (index <= this.MAX_INDEX && emptyBatches < this.MAX_EMPTY_BATCHES && !this.destroyed) {
      const batch = Array.from({ length: this.BATCH_SIZE }, (_, k) => index + k);

      const results = await Promise.all(
        batch.map(async (i) => ({ i, src: await this.resolveIndexSrc(i) })),
      );

      const hits = results.filter((r) => r.src !== null);

      if (hits.length === 0) {
        emptyBatches++;
      } else {
        emptyBatches = 0;
        for (const hit of hits) {
          found.push(this.buildImage(hit.i, hit.src as string));
        }
      }

      if (this.destroyed) return;

      found.sort((a, b) => a.index - b.index);
      this.images.set([...found]);
      this.scannedCount.set(index + this.BATCH_SIZE - 1);

      index += this.BATCH_SIZE;
    }

    if (!this.destroyed) {
      this.isScanning.set(false);
    }
  }

  private async resolveIndexSrc(index: number): Promise<string | null> {
    for (const ext of this.EXTENSIONS) {
      const url = `${this.FOLDER}${this.FILE_PREFIX}${index}.${ext}`;
      // eslint-disable-next-line no-await-in-loop
      const ok = await this.probeImage(url);
      if (ok) return url;
    }
    return null;
  }

  private probeImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  private buildImage(index: number, src: string): GalleryImage {
    const meta = IMAGE_META[index] ?? {};
    const pattern = SIZE_PATTERN[(index - 1) % SIZE_PATTERN.length];

    return {
      index,
      src,
      alt: meta.caption ?? `V Care Education gallery photo ${index}`,
      category: meta.category ?? DEFAULT_CATEGORY,
      caption: meta.caption,
      tag: meta.tag,
      colSpan: meta.colSpan ?? pattern.colSpan,
      rowSpan: meta.rowSpan ?? pattern.rowSpan,
    };
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
    }
  }

  closeLightbox(): void {
    this.lightboxIndex.set(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
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
