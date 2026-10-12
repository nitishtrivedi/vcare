import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { WaveDivider } from '../../../../../components/wave-divider/wave-divider';
import { ProgramAura } from '../program-aura/program-aura';
import { gsap, prefersReducedMotion, registerGsap } from '../../../../../shared/motion/gsap-setup';

@Component({
  selector: 'app-program-hero',
  imports: [RouterLink, WaveDivider, ProgramAura],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-hero.html',
  styleUrl: './program-hero.scss',
})
export class ProgramHero implements AfterViewInit, OnDestroy {
  @ViewChild('heroRoot', { static: true }) private heroRoot!: ElementRef<HTMLElement>;
  @ViewChild('visual', { static: true }) private visual!: ElementRef<HTMLElement>;

  private ctx?: gsap.Context;
  private moveX?: gsap.QuickToFunc;
  private moveY?: gsap.QuickToFunc;

  constructor() {
    registerGsap();
  }

  ngAfterViewInit(): void {
    const root = this.heroRoot.nativeElement;

    if (prefersReducedMotion()) {
      return;
    }

    this.ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.ptt-hero__eyebrow', { autoAlpha: 0, y: 16, duration: 0.6 })
        .from(
          '.ptt-hero__title .ptt-line',
          { yPercent: 110, autoAlpha: 0, duration: 0.95, stagger: 0.14 },
          '-=0.3',
        )
        .from(
          '.ptt-hero__lead, .ptt-hero__actions, .ptt-hero__quote',
          { autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.1 },
          '-=0.6',
        )
        .from(
          '.ptt-hero__frame',
          { autoAlpha: 0, scale: 0.9, duration: 1.2, ease: 'expo.out' },
          '-=0.9',
        )
        .from(
          '.ptt-chip',
          { autoAlpha: 0, scale: 0.7, duration: 0.6, stagger: 0.14, ease: 'back.out(1.7)' },
          '-=0.6',
        );

      gsap.to('.ptt-hero__frame', {
        y: -10,
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.ptt-chip--a', {
        y: -10,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.ptt-chip--b', { y: 9, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.ptt-hero__ring', { rotation: 360, duration: 40, repeat: -1, ease: 'none' });
      gsap.to('.ptt-accent', {
        backgroundPosition: '200% center',
        duration: 8,
        repeat: -1,
        ease: 'none',
      });
    }, root);

    this.moveX = gsap.quickTo(this.visual.nativeElement, 'x', {
      duration: 0.9,
      ease: 'power3.out',
    });
    this.moveY = gsap.quickTo(this.visual.nativeElement, 'y', {
      duration: 0.9,
      ease: 'power3.out',
    });
    root.addEventListener('pointermove', this.onPointerMove);
  }

  // Subtle parallax: the visual drifts a little toward the pointer.
  private onPointerMove = (event: PointerEvent): void => {
    const rect = this.heroRoot.nativeElement.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    this.moveX?.(px * 24);
    this.moveY?.(py * 16);
  };

  ngOnDestroy(): void {
    this.heroRoot.nativeElement.removeEventListener('pointermove', this.onPointerMove);
    this.ctx?.revert();
  }
}
