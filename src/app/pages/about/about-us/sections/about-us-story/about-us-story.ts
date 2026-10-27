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
  selector: 'app-about-us-story',
  imports: [GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us-story.html',
  styleUrl: './about-us-story.scss',
})
export class AboutUsStory implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;

  readonly storyImage = 'assets/images/about-us/about-us-story.JPG';
  private ctx?: gsap.Context;

  constructor() {
    registerGsap();
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;

    this.ctx = gsap.context(() => {
      gsap.from('.ab-story__frame', {
        clipPath: 'inset(0% 100% 0% 0% round 34px)',
        duration: 1.3,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: '.ab-story__visual', start: 'top 75%' },
      });

      gsap.from('.ab-story__quote', {
        autoAlpha: 0,
        y: 40,
        scale: 0.94,
        duration: 1,
        delay: 0.5,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.ab-story__visual', start: 'top 75%' },
      });

      gsap.from('.ab-story__value', {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ab-story__values', start: 'top 85%' },
      });

      gsap.to('.ab-story__accent', {
        y: -14,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.4,
      });
    }, this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
