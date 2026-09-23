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
  //readonly placeholders = Array.from({ length: 6 }, (_, i) => i + 1);
  // ============================================================
  // 🎛️  VIDEO SOURCE — drop files here, named exactly this way:
  //   public/assets/videos/preschool-program/moment-1.mp4
  //   public/assets/videos/preschool-program/moment-2.mp4  ...
  // Optional poster/thumbnail alongside a video:
  //   public/assets/videos/preschool-program/moment-1-poster.jpg
  // ============================================================
  private readonly FOLDER = 'assets/videos/preschool-program/';
  private readonly MANIFEST_URL = `${this.FOLDER}manifest.json`;
  // private readonly FILE_PREFIX = 'moment-';
  // private readonly EXTENSIONS = ['mp4', 'webm'];

  // private readonly BATCH_SIZE = 8;
  // private readonly MAX_EMPTY_BATCHES = 2;
  // private readonly MAX_INDEX = 200;

  private destroyed = false;

  readonly videos = signal<MomentVideo[]>([]);
  readonly isScanning = signal(true);

  ngOnInit(): void {
    this.scan();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.classList.remove('lightbox-open');
    }
  }

  // ---------------- AUTO-DISCOVERY ----------------

  private async scan(): Promise<void> {
    // const found: MomentVideo[] = [];
    // let index = 1;
    // let emptyBatches = 0;

    // while (index <= this.MAX_INDEX && emptyBatches < this.MAX_EMPTY_BATCHES && !this.destroyed) {
    //   const batch = Array.from({ length: this.BATCH_SIZE }, (_, k) => index + k);

    //   const results = await Promise.all(
    //     batch.map(async (i) => ({ i, src: await this.resolveIndexSrc(i) })),
    //   );

    //   const hits = results.filter((r) => r.src !== null);

    //   if (hits.length === 0) {
    //     emptyBatches++;
    //   } else {
    //     emptyBatches = 0;

    //     for (const hit of hits) {
    //       const posterUrl = `${this.FOLDER}${this.FILE_PREFIX}${hit.i}-poster.jpg`;
    //       const hasPoster = await this.probeFile(posterUrl);

    //       found.push({
    //         index: hit.i,
    //         src: hit.src as string,
    //         poster: hasPoster ? posterUrl : undefined,
    //       });
    //     }
    //   }

    //   if (this.destroyed) return;

    //   found.sort((a, b) => a.index - b.index);
    //   this.videos.set([...found]);

    //   index += this.BATCH_SIZE;
    // }

    // if (!this.destroyed) {
    //   this.isScanning.set(false);
    // }
    try {
      const response = await fetch(this.MANIFEST_URL);

      if (!response.ok) {
        // No manifest yet — treat as "nothing uploaded", not an error.
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

  // private async resolveIndexSrc(index: number): Promise<string | null> {
  //   for (const ext of this.EXTENSIONS) {
  //     const url = `${this.FOLDER}${this.FILE_PREFIX}${index}.${ext}`;
  //     // eslint-disable-next-line no-await-in-loop
  //     const ok = await this.probeFile(url);
  //     if (ok) return url;
  //   }
  //   return null;
  // }

  private probeFile(url: string): Promise<boolean> {
    return fetch(url, { method: 'HEAD' })
      .then((res) => res.ok)
      .catch(() => false);
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

  // ---------------- THUMBNAIL RENDERING ----------------

  readonly loadedThumbs = signal<Set<number>>(new Set());

  /**
   * preload="metadata" doesn't guarantee a painted frame in every browser —
   * some just show a blank/black canvas until you seek. Nudging currentTime
   * forces the browser to decode and paint that frame as a thumbnail.
   */
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
}
