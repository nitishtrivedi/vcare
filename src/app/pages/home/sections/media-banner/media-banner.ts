import { AfterViewInit, Component, ElementRef, OnDestroy, signal, ViewChild } from '@angular/core';
import { WaveDivider } from '../../../../components/wave-divider/wave-divider';

@Component({
  selector: 'app-media-banner',
  imports: [WaveDivider],
  templateUrl: './media-banner.html',
  styleUrl: './media-banner.scss',
})
export class MediaBanner implements AfterViewInit, OnDestroy {
  @ViewChild('bannerVideo')
  videoRef!: ElementRef<HTMLVideoElement>;

  readonly isPlaying = signal(false);
  readonly isMuted = signal(true);

  private observer?: IntersectionObserver;
  private manuallyPaused = false;

  ngAfterViewInit(): void {
    const video = this.videoRef.nativeElement;

    // Autoplay requirements
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    // Keep Angular state synced with the REAL video state
    video.addEventListener('play', () => {
      this.isPlaying.set(true);
    });

    video.addEventListener('pause', () => {
      this.isPlaying.set(false);
    });

    video.addEventListener('volumechange', () => {
      this.isMuted.set(video.muted);
    });

    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          if (!this.manuallyPaused && video.paused) {
            video.play().catch((error) => {
              console.error('VIDEO PLAY FAILED:', error);
            });
          }
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.15,
      },
    );

    this.observer.observe(video);
  }

  togglePlay(): void {
    const video = this.videoRef.nativeElement;

    if (video.paused) {
      this.manuallyPaused = false;

      video.play().catch((error) => {
        console.error('Play failed:', error);
      });
    } else {
      this.manuallyPaused = true;
      video.pause();
    }
  }

  toggleMute(): void {
    const video = this.videoRef.nativeElement;

    video.muted = !video.muted;
    this.isMuted.set(video.muted);
  }

  onPlay(): void {
    this.isPlaying.set(true);
  }

  onPause(): void {
    this.isPlaying.set(false);
  }

  onVolumeChange(): void {
    this.isMuted.set(this.videoRef.nativeElement.muted);
  }

  onEnded(): void {
    this.isPlaying.set(false);
    this.manuallyPaused = false;
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
