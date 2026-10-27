import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { GsapReveal } from '../../../../../directives/gsap-reveal';
import { gsap, prefersReducedMotion, registerGsap } from '../../../../../shared/motion/gsap-setup';

@Component({
  selector: 'app-about-us-mission',
  imports: [GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us-mission.html',
  styleUrl: './about-us-mission.scss',
})
export class AboutUsMission implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  constructor() {
    registerGsap();
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;

    this.ctx = gsap.context(() => {
      const trigger = { trigger: '[data-grid]', start: 'top 80%' };

      gsap.from('[data-card]', {
        autoAlpha: 0,
        y: 48,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: trigger,
      });

      gsap.from('[data-icon]', {
        rotate: -90,
        scale: 0.4,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'back.out(1.8)',
        scrollTrigger: trigger,
      });
    }, this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
