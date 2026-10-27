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

@Component({
  selector: 'app-program-hero',
  imports: [RouterLink, WaveDivider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-hero.html',
  styleUrl: './program-hero.scss',
})
export class ProgramHero implements AfterViewInit, OnDestroy {
  @ViewChild('heroRoot', { static: true }) private heroRoot!: ElementRef<HTMLElement>;

  readonly activities = [
    'Yoga',
    'Dance',
    'Chess',
    'Phonics',
    'Origami',
    'Science lab',
    'Sports',
    'Storytelling',
    'Vedic maths',
    'Art & craft',
  ];

  // Duplicated so the marquee loops seamlessly at translateX(-50%).
  readonly ticker = [...this.activities, ...this.activities];

  private ctx?: gsap.Context;
  private root?: HTMLElement;
  private visualX?: gsap.QuickToFunc;
  private visualY?: gsap.QuickToFunc;

  constructor() {
    registerGsap();
  }

  ngAfterViewInit(): void {
    this.root = this.heroRoot.nativeElement;

    if (prefersReducedMotion()) {
      return;
    }

    this.ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.ash-hero__eyebrow', { autoAlpha: 0, y: 16, duration: 0.6 })
        .from(
          '.ash-hero__title .ash-line',
          { yPercent: 110, autoAlpha: 0, duration: 0.95, stagger: 0.14 },
          '-=0.3',
        )
        .from(
          '.ash-hero__lead, .ash-hero__actions, .ash-hero__location',
          { autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.1 },
          '-=0.6',
        )
        .from(
          '.ash-hero__visual',
          { autoAlpha: 0, scale: 0.92, duration: 1.1, ease: 'expo.out' },
          '-=0.9',
        )
        .from(
          '.ash-chip',
          { autoAlpha: 0, scale: 0.7, duration: 0.55, stagger: 0.14, ease: 'back.out(1.7)' },
          '-=0.6',
        );

      gsap.to('.ash-chip--a', {
        y: -10,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.ash-chip--b', { y: 9, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.ash-chip--c', { y: -7, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.ash-orb--blue', {
        x: 60,
        y: -40,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.ash-orb--orange', {
        x: -50,
        y: 50,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, this.root);

    const visual = this.root.querySelector<HTMLElement>('.ash-hero__visual');

    if (visual) {
      this.visualX = gsap.quickTo(visual, 'x', { duration: 0.9, ease: 'power3.out' });
      this.visualY = gsap.quickTo(visual, 'y', { duration: 0.9, ease: 'power3.out' });
      this.root.addEventListener('pointermove', this.onPointerMove);
    }
  }

  // Gentle parallax: the visual drifts slightly toward the pointer.
  private onPointerMove = (event: PointerEvent): void => {
    if (!this.root || !this.visualX || !this.visualY) return;

    const rect = this.root.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    this.visualX(px * 26);
    this.visualY(py * 18);
  };

  ngOnDestroy(): void {
    this.root?.removeEventListener('pointermove', this.onPointerMove);
    this.ctx?.revert();
  }
}
