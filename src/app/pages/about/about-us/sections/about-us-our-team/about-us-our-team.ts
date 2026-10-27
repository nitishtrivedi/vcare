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
  selector: 'app-about-us-our-team',
  imports: [GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us-our-team.html',
  styleUrl: './about-us-our-team.scss',
})
export class AboutUsOurTeam implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;

  readonly teamPhoto = 'assets/images/about-us/team-vcare.JPG';
  readonly points = [
    { title: 'Caring educators', text: 'Teachers who genuinely know and understand each child.' },
    {
      title: 'Collaborative culture',
      text: 'Educators working together to create meaningful experiences.',
    },
    {
      title: 'Child-first thinking',
      text: 'Every decision begins with what is best for the child.',
    },
  ];

  private ctx?: gsap.Context;

  constructor() {
    registerGsap();
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;

    this.ctx = gsap.context(() => {
      gsap.to('.ab-team__photo', {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: this.root.nativeElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.from('.ab-team__point', {
        autoAlpha: 0,
        x: 30,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ab-team__points', start: 'top 85%' },
      });

      gsap.to('.ab-team__mini', {
        y: -8,
        duration: 2.4,
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
