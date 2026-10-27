import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  NgZone,
  OnDestroy,
  signal,
} from '@angular/core';
import { gsap, prefersReducedMotion } from '../../shared/motion/gsap-core';

@Component({
  selector: 'app-scroll-to-top',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.scss',
})
export class ScrollToTop implements AfterViewInit, OnDestroy {
  readonly isVisible = signal(false);
  readonly progress = signal(0);

  readonly circumference = 2 * Math.PI * 22;

  private launching = false;
  private launchTl?: gsap.core.Timeline;
  private pageTween?: gsap.core.Tween;

  private readonly zone = inject(NgZone);

  private scrollRafId = 0;

  constructor() {
    //registerGsap();
  }
  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onWindowScroll, {
        passive: true,
      });

      this.onWindowScroll();
    });
  }
  private readonly onWindowScroll = (): void => {
    if (this.scrollRafId || typeof window === 'undefined') {
      return;
    }

    this.scrollRafId = requestAnimationFrame(() => {
      this.scrollRafId = 0;

      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      const shouldShow = y > 420;

      // Keep scroll progress active while the button's launch animation runs.
      const progressIsRelevant = shouldShow || this.launching;

      const nextProgress = progressIsRelevant && max > 0 ? Math.min(1, y / max) : 0;

      const visibilityChanged = !this.launching && this.isVisible() !== shouldShow;

      const progressThreshold = this.launching ? 0.001 : 0.004;

      const progressChanged = Math.abs(nextProgress - this.progress()) > progressThreshold;

      // Avoid change detection if the visible state has not meaningfully changed.
      if (!visibilityChanged && !progressChanged) {
        return;
      }

      this.zone.run(() => {
        if (visibilityChanged) {
          this.isVisible.set(shouldShow);
        }

        if (progressChanged) {
          this.progress.set(nextProgress);
        }
      });
    });
  };

  get dashOffset(): number {
    return this.circumference * (1 - this.progress());
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    this.progress.set(max > 0 ? Math.min(1, y / max) : 0);

    // Keep the button on screen while it is launching, so the animation is visible.
    if (!this.launching) {
      this.isVisible.set(y > 420);
    }
  }

  scrollToTop(button: HTMLButtonElement, arrow: SVGElement): void {
    if (this.launching) {
      return;
    }

    if (prefersReducedMotion()) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    this.launching = true;
    this.isVisible.set(true);

    this.launchTl = gsap
      .timeline({ onComplete: () => this.finish(button, arrow) })
      // Phase 1: a quick lift and press.
      .to(arrow, { y: -4, duration: 0.12, ease: 'power2.out' })
      .to(button, { scale: 0.92, duration: 0.08, ease: 'power2.in' }, '<')
      .to(button, { scale: 1, duration: 0.2, ease: 'back.out(2)' })
      // Phase 2: glide and rise together.
      .add(() => this.glideToTop(), '-=0.05')
      .to(button, { y: -26, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, '<');
  }

  private glideToTop(): void {
    const start = { y: window.scrollY };

    // Quicker: 0.35s base, grows with distance, capped at 0.8s.
    const duration = Math.min(0.8, 0.35 + start.y / 4000);

    this.pageTween = gsap.to(start, {
      y: 0,
      duration,
      ease: 'power3.out',
      onUpdate: () => window.scrollTo(0, start.y),
    });
  }

  private finish(button: HTMLButtonElement, arrow: SVGElement): void {
    gsap.set(button, { clearProps: 'transform,opacity,visibility' });
    gsap.set(arrow, { clearProps: 'transform' });

    this.launching = false;
    this.isVisible.set(false);
    this.progress.set(0);
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onWindowScroll);
    }

    if (this.scrollRafId) {
      cancelAnimationFrame(this.scrollRafId);
    }
    this.launchTl?.kill();
    this.pageTween?.kill();
  }
}
