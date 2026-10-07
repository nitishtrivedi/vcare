import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[countUp]',
})
export class CountUpDirective implements OnInit, OnDestroy {
  /**
   * The value to count up to.
   * Example: "150+", "100%", "25"
   */
  @Input('countUp') value: string | number = '';

  /**
   * Optional delay before animation starts.
   */
  @Input() countUpDelay = 0;

  private observer?: IntersectionObserver;
  private animationFrameId?: number;
  private delayTimeoutId?: ReturnType<typeof setTimeout>;

  private readonly duration = 2000;
  private hasAnimated = false;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const host = this.el.nativeElement;

    const parsed = this.parseValue(this.value);

    if (!parsed) {
      // Invalid value — leave the original Angular-rendered value untouched.
      return;
    }

    const { targetValue, suffix } = parsed;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Respect accessibility settings.
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      host.textContent = `${targetValue}${suffix}`;
      return;
    }

    // Start observing the number itself.
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || this.hasAnimated) {
            continue;
          }

          this.hasAnimated = true;

          this.delayTimeoutId = setTimeout(() => {
            this.startAnimation(targetValue, suffix, host);
          }, this.countUpDelay);

          this.observer?.unobserve(host);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      },
    );

    this.observer.observe(host);
  }

  private parseValue(value: string | number): { targetValue: number; suffix: string } | null {
    const text = String(value).trim();

    // Supports:
    // 150+
    // 100%
    // 25
    // 5 years
    const match = text.match(/^(\d+(?:\.\d+)?)(.*)$/);

    if (!match) {
      return null;
    }

    const targetValue = Number(match[1]);
    const suffix = match[2] ?? '';

    if (!Number.isFinite(targetValue)) {
      return null;
    }

    return {
      targetValue,
      suffix,
    };
  }

  private startAnimation(targetValue: number, suffix: string, host: HTMLElement): void {
    const animationStart = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - animationStart;
      const progress = Math.min(elapsed / this.duration, 1);

      // Smooth ease-out animation.
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(easedProgress * targetValue);

      host.textContent = `${currentValue}${suffix}`;

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(step);
      } else {
        host.textContent = `${targetValue}${suffix}`;
        this.animationFrameId = undefined;
      }
    };

    this.animationFrameId = requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();

    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.delayTimeoutId !== undefined) {
      clearTimeout(this.delayTimeoutId);
    }
  }
}
