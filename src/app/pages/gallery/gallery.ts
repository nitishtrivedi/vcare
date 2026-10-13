import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { gsap, prefersReducedMotion, registerGsap } from '../../shared/motion/gsap-setup';

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  caption?: string;
  tag?: string;
  colSpan: number;
  rowSpan: number;
  accent: string;
}

interface ManifestEntry {
  src: string;
  category?: string;
  caption?: string;
  tag?: string;
  colSpan?: number;
  rowSpan?: number;
}

const ACCENTS = ['#c93b41', '#e77b30', '#f2b632', '#218768', '#176fae', '#8a5cf6'];

// A rotating bento pattern so photos without explicit sizes still look designed.
const SIZE_PATTERN: Array<{ colSpan: number; rowSpan: number }> = [
  { colSpan: 2, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 2, rowSpan: 1 },
  { colSpan: 1, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 2, rowSpan: 1 },
];

@Component({
  selector: 'app-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.html',
  styleUrl: './gallery.scss',
})
export class Gallery implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;

  private readonly injector = inject(Injector);

  // ============================================================
  // IMAGE SOURCE
  //   public/assets/images/gallery/manifest.json
  //   [ { "src": "gallery-1.jpg", "category": "Classroom", "caption": "...", "tag": "Featured", "colSpan": 2, "rowSpan": 2 } ]
  // Only "src" is required.
  // ============================================================
  private readonly FOLDER = 'assets/images/gallery/';
  private readonly MANIFEST_URL = `${this.FOLDER}manifest.json`;

  private destroyed = false;
  private ctx?: gsap.Context;
  private tileCtx?: gsap.Context;
  private touchStartX: number | null = null;

  readonly skeletons = [0, 1, 2, 3, 4, 5, 6, 7];
  readonly images = signal<GalleryImage[]>([]);
  readonly isScanning = signal(true);
  readonly activeCategory = signal('All');
  readonly lightboxIndex = signal<number | null>(null);

  readonly categories = computed(() => [
    'All',
    ...Array.from(new Set(this.images().map((img) => img.category))),
  ]);

  readonly categoryCount = computed(() => this.categories().length - 1);

  readonly filteredImages = computed(() => {
    const category = this.activeCategory();
    const all = this.images();
    return category === 'All' ? all : all.filter((img) => img.category === category);
  });

  readonly total = computed(() => this.filteredImages().length);

  readonly lightboxImage = computed(() => {
    const index = this.lightboxIndex();
    return index === null ? null : (this.filteredImages()[index] ?? null);
  });

  readonly tickerItems = computed(() => {
    const cats = this.categories().slice(1);
    return [...cats, ...cats, ...cats];
  });

  constructor() {
    registerGsap();
  }

  ngOnInit(): void {
    this.loadManifest();
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;

    this.ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.gx-hero__eyebrow', { autoAlpha: 0, y: 14, duration: 0.6 })
        .from('.gx-word', { yPercent: 115, rotate: 4, duration: 1.1, stagger: 0.1 }, '-=0.3')
        .from(
          '.gx-hero__lead, .gx-chip',
          { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.08 },
          '-=0.7',
        )
        .from('.gx-ticker', { autoAlpha: 0, duration: 0.8 }, '-=0.4')
        .from('.gx-filter', { autoAlpha: 0, y: 20, duration: 0.6 }, '-=0.5');

      gsap.to('.gx-blob--1', {
        x: 90,
        y: 50,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.gx-blob--2', {
        x: -80,
        y: 60,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.gx-blob--3', {
        x: 50,
        y: -70,
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.gx-blob--4', {
        x: -60,
        y: -40,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.gx-chip__dot', {
        scale: 1.7,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.2,
      });
    }, this.root.nativeElement);

    // Park the active-pill indicator under the "All" pill on first paint.
    const first = this.root.nativeElement.querySelector<HTMLElement>('.gx-pill');
    const indicator = this.root.nativeElement.querySelector<HTMLElement>('.gx-filter__ind');
    if (first && indicator) {
      gsap.set(indicator, { x: first.offsetLeft, width: first.offsetWidth });
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.ctx?.revert();
    this.tileCtx?.revert();
    this.lockBody(false);
  }

  // ---------- LOADING ----------

  private async loadManifest(): Promise<void> {
    try {
      const response = await fetch(this.MANIFEST_URL);
      if (!response.ok) return;

      const entries = (await response.json()) as ManifestEntry[];
      const list = entries.map((entry, i) => this.buildImage(i + 1, entry));

      if (!this.destroyed) {
        this.images.set(list);
        afterNextRender(() => this.revealTiles(), { injector: this.injector });
      }
    } catch {
      // Missing or malformed manifest: show the empty state quietly.
    } finally {
      if (!this.destroyed) this.isScanning.set(false);
    }
  }

  private buildImage(id: number, entry: ManifestEntry): GalleryImage {
    const pattern = SIZE_PATTERN[(id - 1) % SIZE_PATTERN.length];

    return {
      id,
      src: `${this.FOLDER}${entry.src}`,
      alt: entry.caption ?? `V Care gallery photo ${id}`,
      category: entry.category ?? 'V Care Moments',
      caption: entry.caption,
      tag: entry.tag,
      colSpan: entry.colSpan ?? pattern.colSpan,
      rowSpan: entry.rowSpan ?? pattern.rowSpan,
      accent: ACCENTS[(id - 1) % ACCENTS.length],
    };
  }

  /** Drop only the tile whose file is missing. */
  onImageError(id: number): void {
    this.images.update((list) => list.filter((img) => img.id !== id));
  }

  // ---------- GRID ANIMATION ----------

  private revealTiles(): void {
    if (prefersReducedMotion()) return;

    this.tileCtx?.revert();
    this.tileCtx = gsap.context(() => {
      gsap.from('.gx-tile', {
        autoAlpha: 0,
        y: 80,
        scale: 0.9,
        rotate: 2,
        duration: 1,
        stagger: { each: 0.08, from: 'start' },
        ease: 'power4.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.gx-grid', start: 'top 85%' },
      });
    }, this.root.nativeElement);
  }

  private animateTilesIn(): void {
    if (prefersReducedMotion()) return;

    gsap.fromTo(
      this.root.nativeElement.querySelectorAll('.gx-tile'),
      { autoAlpha: 0, scale: 0.8, y: 30 },
      {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: 'back.out(1.2)',
        clearProps: 'transform',
      },
    );
  }

  setCategory(category: string, event: Event): void {
    if (category === this.activeCategory()) return;

    const pill = event.currentTarget as HTMLElement;
    this.moveIndicator(pill);

    const tiles = this.root.nativeElement.querySelectorAll('.gx-tile');

    if (prefersReducedMotion() || tiles.length === 0) {
      this.activeCategory.set(category);
      return;
    }

    gsap.to(tiles, {
      autoAlpha: 0,
      scale: 0.8,
      y: 24,
      duration: 0.25,
      stagger: 0.015,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => {
        this.activeCategory.set(category);
        afterNextRender(() => this.animateTilesIn(), { injector: this.injector });
      },
    });
  }

  private moveIndicator(pill: HTMLElement): void {
    const indicator = this.root.nativeElement.querySelector<HTMLElement>('.gx-filter__ind');
    if (!indicator) return;

    gsap.to(indicator, {
      x: pill.offsetLeft,
      width: pill.offsetWidth,
      duration: 0.7,
      ease: 'elastic.out(1, 0.75)',
    });
  }

  // ---------- 3D TILT ----------

  tilt(event: PointerEvent): void {
    if (prefersReducedMotion() || event.pointerType !== 'mouse') return;

    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    gsap.to(el, {
      rotateY: (px - 0.5) * 14,
      rotateX: (0.5 - py) * 14,
      transformPerspective: 900,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  }

  untilt(event: PointerEvent): void {
    if (prefersReducedMotion()) return;

    gsap.to(event.currentTarget as HTMLElement, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
    });
  }

  // ---------- LIGHTBOX ----------

  openLightbox(index: number): void {
    this.lightboxIndex.set(index);
    this.lockBody(true);

    afterNextRender(
      () => {
        if (prefersReducedMotion()) return;

        gsap.fromTo(
          '.gx-lb',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.45, ease: 'power2.out' },
        );
        gsap.fromTo(
          '.gx-lb__frame',
          { scale: 0.82, autoAlpha: 0, rotate: -3 },
          { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.8, ease: 'expo.out' },
        );
        gsap.fromTo(
          '.gx-lb__thumb',
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.03, delay: 0.2 },
        );
      },
      { injector: this.injector },
    );
  }

  closeLightbox(): void {
    if (this.lightboxIndex() === null) return;

    const finish = () => {
      this.lightboxIndex.set(null);
      this.lockBody(false);
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    gsap.to('.gx-lb', { autoAlpha: 0, duration: 0.3, ease: 'power2.in', onComplete: finish });
  }

  go(direction: 1 | -1, event?: Event): void {
    event?.stopPropagation();

    const total = this.total();
    if (!total) return;

    const step = () => this.lightboxIndex.update((i) => ((i ?? 0) + direction + total) % total);

    const frame = this.root.nativeElement.querySelector<HTMLElement>('.gx-lb__frame');

    if (prefersReducedMotion() || !frame) {
      step();
      return;
    }

    gsap.to(frame, {
      x: -direction * 90,
      rotate: -direction * 2,
      autoAlpha: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        step();
        afterNextRender(
          () =>
            gsap.fromTo(
              frame,
              { x: direction * 90, rotate: direction * 2, autoAlpha: 0 },
              { x: 0, rotate: 0, autoAlpha: 1, duration: 0.55, ease: 'expo.out' },
            ),
          { injector: this.injector },
        );
      },
    });
  }

  jumpTo(index: number): void {
    this.lightboxIndex.set(index);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.lightboxIndex() === null) return;

    if (event.key === 'Escape') this.closeLightbox();
    else if (event.key === 'ArrowRight') this.go(1);
    else if (event.key === 'ArrowLeft') this.go(-1);
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0]?.clientX ?? null;
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.touchStartX === null) return;

    const dx = (event.changedTouches[0]?.clientX ?? 0) - this.touchStartX;
    this.touchStartX = null;

    if (Math.abs(dx) > 50) this.go(dx < 0 ? 1 : -1);
  }

  // ---------- HELPERS ----------

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  trackById(_: number, img: GalleryImage): number {
    return img.id;
  }

  private lockBody(locked: boolean): void {
    document.body.style.overflow = locked ? 'hidden' : '';
    document.body.classList.toggle('lightbox-open', locked);
  }
}
