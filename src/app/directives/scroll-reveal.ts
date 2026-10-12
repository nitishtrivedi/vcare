import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';

import { observeReveal } from '../shared/motion/reveal-observer';

export type RevealType = 'fade-up' | 'fade-in' | 'zoom-in' | 'slide-left' | 'slide-right' | 'pop';

@Directive({
  selector: '[vcReveal]',
})
export class ScrollReveal implements OnInit, OnDestroy {
  @Input('vcReveal') type: RevealType | '' = 'fade-up';
  @Input('vcRevealDelay') delay = 0;

  private stopObserving?: () => void;

  private readonly prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly zone: NgZone,
  ) {}

  ngOnInit(): void {
    const host = this.el.nativeElement;
    const type = this.type || 'fade-up';

    this.renderer.addClass(host, 'reveal');
    this.renderer.addClass(host, `reveal--${type}`);
    this.renderer.setStyle(host, '--reveal-delay', `${this.delay}ms`);

    if (this.prefersReducedMotion) {
      this.renderer.addClass(host, 'reveal--visible');
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.stopObserving = observeReveal(host, () => {
        this.renderer.addClass(host, 'reveal--visible');
      });
    });
  }

  ngOnDestroy(): void {
    this.stopObserving?.();
  }
}
