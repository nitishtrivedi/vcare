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
  @ViewChild('heroRoot', { static: true })
  private heroRoot!: ElementRef<HTMLElement>;

  private context?: gsap.Context;

  constructor() {
    registerGsap();
  }

  ngAfterViewInit(): void {
    const root = this.heroRoot.nativeElement;

    if (prefersReducedMotion()) {
      return;
    }

    this.context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      });

      const eyebrow = root.querySelector('.program-hero__eyebrow');
      const title = root.querySelector('.program-hero__title');
      const subtitle = root.querySelector('.program-hero__subtitle');
      const description = root.querySelector('.program-hero__description');
      const actions = root.querySelectorAll('.program-hero__button');
      const meta = root.querySelector('.program-hero__meta');
      const location = root.querySelector('.program-hero__location');
      const visual = root.querySelector('.program-hero__visual');
      const floatingCards = root.querySelectorAll('.program-hero__floating-card');

      if (eyebrow) {
        timeline.from(eyebrow, {
          autoAlpha: 0,
          y: 16,
          duration: 0.55,
        });
      }

      if (title) {
        timeline.from(
          title,
          {
            autoAlpha: 0,
            y: 28,
            duration: 0.75,
          },
          '-=0.28',
        );
      }

      if (subtitle) {
        timeline.from(
          subtitle,
          {
            autoAlpha: 0,
            y: 14,
            duration: 0.45,
          },
          '-=0.38',
        );
      }

      if (description) {
        timeline.from(
          description,
          {
            autoAlpha: 0,
            y: 15,
            duration: 0.5,
          },
          '-=0.25',
        );
      }

      if (actions.length) {
        timeline.from(
          actions,
          {
            autoAlpha: 0,
            y: 13,
            duration: 0.4,
            stagger: 0.1,
          },
          '-=0.2',
        );
      }

      if (meta) {
        timeline.from(
          meta,
          {
            autoAlpha: 0,
            y: 12,
            duration: 0.45,
          },
          '-=0.15',
        );
      }

      if (location) {
        timeline.from(
          location,
          {
            autoAlpha: 0,
            y: 10,
            duration: 0.4,
          },
          '-=0.2',
        );
      }

      if (visual) {
        timeline.from(
          visual,
          {
            autoAlpha: 0,
            scale: 0.96,
            y: 18,
            duration: 0.85,
          },
          '-=0.85',
        );
      }

      if (floatingCards.length) {
        timeline.from(
          floatingCards,
          {
            autoAlpha: 0,
            scale: 0.94,
            y: 14,
            duration: 0.48,
            stagger: 0.12,
          },
          '-=0.45',
        );
      }

      const photo = root.querySelector('.program-hero__photo');

      if (photo) {
        gsap.to(photo, {
          y: -7,
          duration: 3.2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      floatingCards.forEach((card, index) => {
        gsap.to(card, {
          y: index === 0 ? -7 : 7,
          duration: 2.5 + index * 0.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: index * 0.2,
        });
      });

      gsap.to(root.querySelectorAll('.program-hero__decor'), {
        y: -6,
        rotation: 8,
        duration: 2,
        ease: 'sine.inOut',
        stagger: 0.24,
        repeat: -1,
        yoyo: true,
      });
    }, root);
  }

  ngOnDestroy(): void {
    this.context?.revert();
  }
}
