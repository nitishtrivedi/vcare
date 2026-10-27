import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { gsap, prefersReducedMotion, registerGsap } from '../../../../../shared/motion/gsap-setup';

/**
 * Decorative, non-interactive backdrop: a generated topographic contour
 * field that slowly rotates, plus a soft sun glow that drifts.
 * Place as the first child of a position: relative section.
 */
@Component({
  selector: 'app-daycare-backdrop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daycare-backdrop.html',
  styleUrl: './daycare-backdrop.scss',
})
export class DaycareBackdrop implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;

  readonly rings: string[] = this.buildRings(8);

  private ctx?: gsap.Context;

  constructor() {
    registerGsap();
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) {
      return;
    }

    this.ctx = gsap.context(() => {
      gsap.from('.dcb__ring', {
        autoAlpha: 0,
        scale: 0.94,
        transformOrigin: '50% 50%',
        duration: 1.8,
        stagger: 0.12,
        ease: 'power2.out',
      });

      gsap.to('.dcb__rings', {
        rotation: 360,
        transformOrigin: '50% 50%',
        duration: 140,
        repeat: -1,
        ease: 'none',
      });

      gsap.to('.dcb__ring', {
        scale: 1.015,
        transformOrigin: '50% 50%',
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.5, from: 'center' },
      });

      gsap.to('.dcb__sun', {
        x: 40,
        y: -26,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, this.root.nativeElement);
  }

  // Builds closed, slightly irregular rings as SVG path strings.
  private buildRings(count: number): string[] {
    const cx = 600;
    const cy = 400;
    const paths: string[] = [];

    for (let k = 1; k <= count; k++) {
      const base = 90 + k * 52;
      const points: string[] = [];

      for (let i = 0; i <= 120; i++) {
        const t = (i / 120) * Math.PI * 2;
        const r = base * (1 + 0.07 * Math.sin(3 * t + k * 0.9) + 0.045 * Math.cos(5 * t - k * 0.6));
        points.push(
          `${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * 0.72 * Math.sin(t)).toFixed(1)}`,
        );
      }

      paths.push('M' + points.join(' L') + ' Z');
    }

    return paths;
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
