import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { GsapReveal } from '../../../../../directives/gsap-reveal';

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
  imports: [GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-moments.html',
  styleUrl: './program-moments.scss',
})
export class ProgramMoments implements OnInit, OnDestroy {
  // ============================================================
  // VIDEO SOURCE
  // Add or remove videos by editing manifest.json, no code changes:
  //   public/assets/videos/after-school-program/manifest.json
  //   [ { "src": "moment-1.mp4", "poster": "moment-1-poster.jpg" }, { "src": "moment-2.mp4" } ]
  // ============================================================
  private readonly FOLDER = 'assets/videos/after-school-program/';
  private readonly MANIFEST_URL = `${this.FOLDER}manifest.json`;

  private destroyed = false;

  readonly videos = signal<MomentVideo[]>([]);
  readonly isScanning = signal(true);
  readonly loadedThumbs = signal<Set<number>>(new Set());

  // Array index of the open video, or null when closed.
  readonly lightboxIndex = signal<number | null>(null);

  readonly lightboxVideo = computed(() => {
    const idx = this.lightboxIndex();
    return idx === null ? null : (this.videos()[idx] ?? null);
  });

  ngOnInit(): void {
    this.loadManifest();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.lockBody(false);
  }

  private async loadManifest(): Promise<void> {
    try {
      const response = await fetch(this.MANIFEST_URL);

      if (!response.ok) {
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
      // Missing or malformed manifest: show the empty state quietly.
    } finally {
      if (!this.destroyed) {
        this.isScanning.set(false);
      }
    }
  }

  // Seek a little in so browsers paint a real thumbnail frame.
  onThumbMetadata(event: Event): void {
    const video = event.target as HTMLVideoElement;
    try {
      const duration = video.duration || 0;
      video.currentTime = duration > 1 ? Math.min(1, duration / 4) : 0.1;
    } catch {
      // Not seekable yet; safe to ignore.
    }
  }

  onThumbReady(index: number): void {
    this.loadedThumbs.update((current) => {
      const next = new Set(current);
      next.add(index);
      return next;
    });
  }

  openLightbox(index: number): void {
    this.lightboxIndex.set(index);
    this.lockBody(true);
  }

  closeLightbox(): void {
    this.lightboxIndex.set(null);
    this.lockBody(false);
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

  private lockBody(locked: boolean): void {
    document.body.style.overflow = locked ? 'hidden' : '';
    document.body.classList.toggle('lightbox-open', locked);
  }
}
