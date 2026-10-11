import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';
import {
  gsap,
  ScrollTrigger,
  registerGsap,
  prefersReducedMotion,
} from '../shared/motion/gsap-setup';
import { MOTION, RevealType } from '../shared/motion/motion.tokens';

registerGsap();

@Directive({
  selector: '[gsapReveal]',
})
export class GsapReveal implements AfterViewInit, OnDestroy {
  /** Same values as before: fade-up, fade-in, zoom-in, slide-left, slide-right, pop */
  @Input('gsapReveal') type: RevealType | '' = 'fade-up';

  /** Delay in ms, for staggering items in a loop */
  @Input('gsapRevealDelay') delay = 0;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly zone = inject(NgZone);
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    // Reduced motion: show the element immediately, no animation
    if (prefersReducedMotion()) {
      this.el.style.opacity = '1';
      return;
    }

    // Keep scroll listeners outside Angular's change detection
    this.zone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        const type = this.type || 'fade-up';
        const from = this.fromVars(type);
        const token = this.tokenFor(type);

        gsap.from(this.el, {
          ...from,
          duration: token.duration,
          ease: token.ease,
          delay: this.delay / 1000,
          scrollTrigger: {
            trigger: this.el,
            start: 'top 85%',
            once: true,
          },
        });
      }, this.el);
    });
  }

  private fromVars(type: RevealType) {
    switch (type) {
      case 'slide-left':
        return { opacity: 0, x: MOTION.slideLeft.x };
      case 'slide-right':
        return { opacity: 0, x: MOTION.slideRight.x };
      case 'zoom-in':
        return { opacity: 0, scale: MOTION.zoomIn.scale };
      case 'pop':
        return { opacity: 0, scale: MOTION.pop.scale };
      case 'fade-in':
        return { opacity: 0 };
      case 'fade-up':
      default:
        return { opacity: 0, y: MOTION.fadeUp.y };
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
    // Removes ScrollTriggers and tweens belonging to this element
    this.ctx?.revert();
  }
}
