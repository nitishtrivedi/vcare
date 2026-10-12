import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap, prefersReducedMotion } from '../../../../shared/motion/gsap-setup';

interface HeroWord {
  text: string;
  accent: boolean;
}

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;

  private readonly zone = inject(NgZone);
  private ctx?: gsap.Context;

  readonly words: HeroWord[] = [
    { text: 'Smart', accent: false },
    { text: 'Learning.', accent: false },
    { text: 'Global', accent: true },
    { text: 'thinking.', accent: false },
  ];

  ngAfterViewInit(): void {
    const useStaticHero =
      typeof window === 'undefined' ||
      window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;

    if (prefersReducedMotion() || useStaticHero) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.ctx = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .from('.hero__kicker', { opacity: 0, y: 20, duration: 0.7 })
          .from('.hero__word', { yPercent: 110, duration: 1.1, stagger: 0.08 }, '-=0.4')
          .from(
            '.hero__lead, .hero__actions',
            { opacity: 0, y: 24, duration: 0.8, stagger: 0.12 },
            '-=0.7',
          )
          .from('.hero__chip', { opacity: 0, y: 20, duration: 0.7, stagger: 0.1 }, '-=0.5')
          .from('.hero__frame', { opacity: 0, scale: 0.9, duration: 1.4, ease: 'expo.out' }, 0.2)
          .from(
            '.hero__float',
            { opacity: 0, scale: 0.8, duration: 0.8, stagger: 0.15, ease: 'back.out(1.6)' },
            '-=0.9',
          );

        gsap.to('.hero__orb--blue', {
          x: 60,
          y: -40,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        gsap.to('.hero__orb--red', {
          x: -50,
          y: 50,
          duration: 11,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        gsap.to('.hero__float--top', {
          y: -12,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        gsap.to('.hero__float--bottom', {
          y: 12,
          duration: 3.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }, this.root.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
