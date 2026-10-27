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
  selector: 'app-about-us-trust',
  imports: [GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us-trust.html',
  styleUrl: './about-us-trust.scss',
})
export class AboutUsTrust implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  readonly trustedByParents = [
    '24×7 security guard & full CCTV surveillance',
    'Daily sanitization, pest control & fumigation',
    'Daily temperature checks & regular health checkups',
    'Clean toys, equipment & child-friendly washrooms',
    'Strict staff hygiene & safety protocols',
    'Caring, trained educators',
    'Structured day with learning + play',
    'Safe, clean & child-friendly environment',
  ];

  readonly insideVCare = [
    'Carpeted classrooms',
    'Child-friendly furniture',
    'Clean toys and learning materials',
    'Indoor play area',
    'Indoor games',
    'Sand pit zone',
    "Kids' swimming pool",
    'Library books & reading corner',
  ];

  constructor() {
    registerGsap();
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;

    this.ctx = gsap.context(() => {
      gsap.from('[data-trust-item]', {
        autoAlpha: 0,
        x: -16,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-trust-grid]', start: 'top 82%' },
      });

      gsap.from('[data-trust-tick]', {
        scale: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: '[data-trust-grid]', start: 'top 82%' },
      });
    }, this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
