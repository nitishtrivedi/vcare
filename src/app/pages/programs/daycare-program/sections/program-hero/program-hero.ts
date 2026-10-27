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
import { gsap, prefersReducedMotion, registerGsap } from '../../../../../shared/motion/gsap-setup';
import { DaycareBackdrop } from '../daycare-backdrop/daycare-backdrop';

@Component({
  selector: 'app-program-hero',
  imports: [RouterLink, WaveDivider, DaycareBackdrop],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-hero.html',
  styleUrl: './program-hero.scss',
})
export class ProgramHero implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;
  @ViewChild('visual', { static: true }) private visual!: ElementRef<HTMLElement>;

  private ctx?: gsap.Context;
  private moveX?: gsap.QuickToFunc;
  private moveY?: gsap.QuickToFunc;

  constructor() {
    registerGsap();
  }

  ngAfterViewInit(): void {
    const root = this.root.nativeElement;

    if (prefersReducedMotion()) {
      // Show final numbers immediately when motion is reduced.
      root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        el.textContent = el.getAttribute('data-count') ?? '';
      });
      return;
    }

    this.ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.dc-hero__eyebrow', { autoAlpha: 0, y: 14, duration: 0.6 })
        .from('.dc-line', { yPercent: 110, autoAlpha: 0, duration: 1, stagger: 0.14 }, '-=0.3')
        .from(
          '.dc-hero__lead, .dc-hero__actions, .dc-hero__stats',
          { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.1 },
          '-=0.6',
        )
        .from(
          this.visual.nativeElement,
          { autoAlpha: 0, scale: 0.94, duration: 1.2, ease: 'expo.out' },
          '-=1',
        )
        .from('.dc-note', { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.15 }, '-=0.7');

      // Count-up for numeric stats.
      root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.getAttribute('data-count'));
        const counter = { v: 0 };

        gsap.to(counter, {
          v: target,
          duration: 2.2,
          delay: 0.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v));
          },
        });
      });

      gsap.to('.dc-hero__arch', {
        y: -12,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.dc-note--a', { y: -8, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.dc-note--b', { y: 8, duration: 3.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }, root);

    this.moveX = gsap.quickTo(this.visual.nativeElement, 'x', { duration: 1, ease: 'power3.out' });
    this.moveY = gsap.quickTo(this.visual.nativeElement, 'y', { duration: 1, ease: 'power3.out' });
    root.addEventListener('pointermove', this.onPointerMove);
  }

  // Gentle parallax: the visual drifts a little toward the pointer.
  private onPointerMove = (event: PointerEvent): void => {
    const rect = this.root.nativeElement.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    this.moveX?.(px * 22);
    this.moveY?.(py * 14);
  };

  ngOnDestroy(): void {
    this.root.nativeElement.removeEventListener('pointermove', this.onPointerMove);
    this.ctx?.revert();
  }
}
