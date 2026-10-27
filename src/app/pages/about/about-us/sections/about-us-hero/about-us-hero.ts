import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { GsapReveal } from '../../../../../directives/gsap-reveal';
import { gsap, prefersReducedMotion, registerGsap } from '../../../../../shared/motion/gsap-setup';

@Component({
  selector: 'app-about-us-hero',
  imports: [RouterLink, GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us-hero.html',
  styleUrl: './about-us-hero.scss',
})
export class AboutUsHero implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;

  readonly heroImage = 'assets/images/about-us/about-us-hero.JPG';
  private ctx?: gsap.Context;

  constructor() {
    registerGsap();
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;

    this.ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .from('.ab-hero__eyebrow', { autoAlpha: 0, y: 16, duration: 0.7 })
        .from('.ab-hero__line', { yPercent: 110, duration: 1.1, stagger: 0.14 }, '-=0.4')
        .fromTo(
          '.ab-hero__squiggle path',
          { strokeDashoffset: 320 },
          { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' },
          '-=0.6',
        )
        .from(
          '.ab-hero__lead, .ab-hero__actions, .ab-hero__stat',
          { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.1 },
          '-=0.9',
        )
        .from(
          '.ab-hero__frame',
          { clipPath: 'inset(0% 0% 100% 0% round 36px)', duration: 1.3, ease: 'expo.inOut' },
          '-=1.2',
        )
        .from(
          '.ab-hero__chip',
          { autoAlpha: 0, scale: 0.8, duration: 0.7, stagger: 0.15, ease: 'back.out(1.6)' },
          '-=0.6',
        );

      gsap.to('.ab-hero__chip--a', {
        y: -10,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.ab-hero__chip--b', {
        y: 10,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.ab-hero__halo', {
        scale: 1.06,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.ab-hero__blob-a', {
        x: -60,
        y: 40,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.ab-hero__blob-b', {
        x: 50,
        y: -30,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
