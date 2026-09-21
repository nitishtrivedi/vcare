import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

export type RevealType = 'fade-up' | 'fade-in' | 'zoom-in' | 'slide-left' | 'slide-right' | 'pop';

@Directive({
  selector: '[vcReveal]',
})
export class ScrollReveal implements OnInit, OnDestroy {
  /** Animation style: fade-up (default), fade-in, zoom-in, slide-left, slide-right, pop */
  @Input('vcReveal') type: RevealType | '' = 'fade-up';

  /** Delay in ms, useful for staggering items in a loop: [vcRevealDelay]="i * 90" */
  @Input('vcRevealDelay') delay = 0;

  private observer?: IntersectionObserver;
  private readonly prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    const host = this.el.nativeElement;
    const type = this.type || 'fade-up';

    this.renderer.addClass(host, 'reveal');
    this.renderer.addClass(host, `reveal--${type}`);
    this.renderer.setStyle(host, '--reveal-delay', `${this.delay}ms`);

    if (this.prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(host, 'reveal--visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(host, 'reveal--visible');
            this.observer?.unobserve(host);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
