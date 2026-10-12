import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { GsapReveal } from '../../../../../directives/gsap-reveal';
import { ProgramAura } from '../program-aura/program-aura';
import { gsap, prefersReducedMotion, registerGsap } from '../../../../../shared/motion/gsap-setup';

interface WhyPoint {
  title: string;
  accent: string;
}

@Component({
  selector: 'app-program-why',
  imports: [GsapReveal, ProgramAura],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-why.html',
  styleUrl: './program-why.scss',
})
export class ProgramWhy implements AfterViewInit, OnDestroy {
  @ViewChild('journey', { static: true }) private journey!: ElementRef<HTMLElement>;

  private ctx?: gsap.Context;

  readonly points: WhyPoint[] = [
    { title: 'Open to any parent or caregiver, not limited to mothers', accent: '#eb2027' },
    { title: 'Dedicated, distraction-free time with your toddler', accent: '#f69220' },
    { title: 'Sensory play that sparks exploration and curiosity', accent: '#e0a800' },
    { title: 'Physical activities that support motor development', accent: '#2f9e44' },
    { title: 'Stimulates healthy brain growth in the critical early years', accent: '#2f9e44' },
    { title: 'Builds early language and social interaction skills', accent: '#006fb9' },
    { title: 'Eases the eventual transition into formal preschool', accent: '#874d3e' },
    { title: 'Connects you with other like-minded parents nearby', accent: '#0d2d4f' },
  ];

  constructor() {
    registerGsap();
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) {
      return;
    }

    // The progress line fills as the reader scrolls through the journey.
    this.ctx = gsap.context(() => {
      gsap.fromTo(
        '.ptt-why__progress',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: this.journey.nativeElement,
            start: 'top 75%',
            end: 'bottom 65%',
            scrub: true,
          },
        },
      );
    }, this.journey.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
