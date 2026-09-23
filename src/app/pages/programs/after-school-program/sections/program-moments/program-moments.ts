import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

export interface MomentVideo {
  index: number;
  src: string;
  poster?: string;
}

interface ManifestEntry {
  src: string;
  poster?: string;
}

@Component({
  selector: 'app-program-moments',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-moments.html',
  styleUrl: './program-moments.scss',
})
export class ProgramMoments implements OnInit, OnDestroy {
  // ============================================================
  // 🎛️  VIDEO SOURCE
  // Add or remove videos by editing the manifest file below —
  // no code changes needed.
  //
  //   public/assets/videos/after-school-program/manifest.json
  //   public/assets/videos/after-school-program/moment-1.mp4
  //   public/assets/videos/after-school-program/moment-2.mp4  ...
  //
  // manifest.json looks like:
  //   [
  //     { "src": "moment-1.mp4", "poster": "moment-1-poster.jpg" },
  //     { "src": "moment-2.mp4" }
  //   ]
  // ============================================================
  private readonly FOLDER = 'assets/videos/after-school-program/';
  private readonly MANIFEST_URL = `${this.FOLDER}manifest.json`;

  private destroyed = false;

  readonly videos = signal<MomentVideo[]>([]);
  readonly isScanning = signal(true);

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

  private async loadManifest(): Promise<void> {
    try {
      const response = await fetch(this.MANIFEST_URL);

      if (!response.ok) {
        if (!this.destroyed) this.isScanning.set(false);
        return;
      }

      const entries = (await response.json()) as ManifestEntry[];

      const list: MomentVideo[] = entries.map((entry, i) => ({
        index: i + 1,
        src: `${this.FOLDER}${entry.src}`,
        poster: entry.poster ? `${this.FOLDER}${entry.poster}` : undefined,
      }));

      if (!this.destroyed) {
        this.videos.set(list);
      }
    } catch {
      // Manifest missing or malformed — fall back to empty state quietly.
    } finally {
      if (!this.destroyed) {
        this.isScanning.set(false);
      }
    }
  }

  // ---------------- THUMBNAIL RENDERING ----------------

  readonly loadedThumbs = signal<Set<number>>(new Set());

  onThumbMetadata(event: Event): void {
    const video = event.target as HTMLVideoElement;
    try {
      const duration = video.duration || 0;
      video.currentTime = duration > 1 ? Math.min(1, duration / 4) : 0.1;
    } catch {
      // Some browsers throw if the video isn't seekable yet — safe to ignore.
    }
  }

  onThumbReady(index: number): void {
    this.loadedThumbs.update((current) => {
      const next = new Set(current);
      next.add(index);
      return next;
    });
  }

  // ---------------- LIGHTBOX ----------------

  readonly lightboxIndex = signal<number | null>(null);

  readonly lightboxVideo = computed(() => {
    const idx = this.lightboxIndex();
    const list = this.videos();
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
    const total = this.videos().length;
    const idx = this.lightboxIndex();
    if (idx === null || total === 0) return;
    this.lightboxIndex.set((idx + 1) % total);
  }

  prev(event?: Event): void {
    event?.stopPropagation();
    const total = this.videos().length;
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

  trackByIndex(_: number, video: MomentVideo): number {
    return video.index;
  }
}
