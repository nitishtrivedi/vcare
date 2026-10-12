import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { gsap, prefersReducedMotion, registerGsap } from '../../../../../shared/motion/gsap-setup';

export type AuraVariant = 'warm' | 'cool' | 'fresh';

/**
 * Decorative, non-interactive background: three heavily blurred gradient
 * blobs that drift slowly with GSAP. Drop it as the first child of any
 * section (the section must be position: relative; overflow: hidden).
 */
@Component({
  selector: 'app-program-aura',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-aura.html',
  styleUrl: './program-aura.scss',
})
export class ProgramAura implements AfterViewInit, OnDestroy {
  @Input() variant: AuraVariant = 'warm';

  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;

  private ctx?: gsap.Context;

  constructor() {
    registerGsap();
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) {
      return;
    }

    const el = this.root.nativeElement;

    this.ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>('.aura__blob').forEach((blob, i) => {
        gsap.to(blob, {
          x: gsap.utils.random(-120, 120),
          y: gsap.utils.random(-90, 90),
          scale: gsap.utils.random(0.9, 1.18),
          duration: gsap.utils.random(8, 13),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.8,
        });
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
