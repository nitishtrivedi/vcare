import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';

import { observeReveal } from '../shared/motion/reveal-observer';
import { MOTION, RevealType } from '../shared/motion/motion.tokens';
import { gsap, prefersReducedMotion } from '../shared/motion/gsap-core';

@Directive({
  selector: '[gsapReveal]',
})
export class GsapReveal implements AfterViewInit, OnDestroy {
  @Input('gsapReveal') type: RevealType | '' = 'fade-up';
  @Input('gsapRevealDelay') delay = 0;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private readonly zone = inject(NgZone);

  private ctx?: gsap.Context;
  private stopObserving?: () => void;

  ngAfterViewInit(): void {
    // Content should remain visible when motion is reduced.
    if (prefersReducedMotion()) {
      return;
    }

    const type = this.type || 'fade-up';

    const compact =
      typeof window === 'undefined' ||
      window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;

    const from = this.fromVars(type, compact);
    const token = this.tokenFor(type);

    this.zone.runOutsideAngular(() => {
      this.stopObserving = observeReveal(this.el, () => {
        this.ctx = gsap.context(() => {
          gsap.from(this.el, {
            ...from,
            duration: compact ? Math.min(token.duration, 0.35) : token.duration,
            ease: token.ease,
            delay: compact ? 0 : Math.max(0, this.delay) / 1000,
            overwrite: 'auto',
          });
        }, this.el);
      });
    });
  }

  private fromVars(type: RevealType, compact: boolean) {
    const slideDistance = compact ? 18 : 60;
    const fadeDistance = compact ? 18 : MOTION.fadeUp.y;

    switch (type) {
      case 'slide-left':
        return {
          opacity: 0,
          x: compact ? -slideDistance : MOTION.slideLeft.x,
        };

      case 'slide-right':
        return {
          opacity: 0,
          x: compact ? slideDistance : MOTION.slideRight.x,
        };

      case 'zoom-in':
        return {
          opacity: 0,
          scale: compact ? 0.97 : MOTION.zoomIn.scale,
        };

      case 'pop':
        return {
          opacity: 0,
          scale: compact ? 0.92 : MOTION.pop.scale,
        };

      case 'fade-in':
        return { opacity: 0 };

      case 'fade-up':
      default:
        return { opacity: 0, y: fadeDistance };
    }
  }

  private tokenFor(type: RevealType) {
    switch (type) {
      case 'slide-left':
        return MOTION.slideLeft;

      case 'slide-right':
        return MOTION.slideRight;

      case 'zoom-in':
        return MOTION.zoomIn;

      case 'pop':
        return MOTION.pop;

      default:
        return MOTION.fadeUp;
    }
  }

  ngOnDestroy(): void {
    this.stopObserving?.();
    this.ctx?.revert();
  }
}
