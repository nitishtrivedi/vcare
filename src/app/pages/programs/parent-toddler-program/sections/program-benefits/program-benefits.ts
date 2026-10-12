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

interface BenefitCircle {
  text: string;
  accent: string;
}

interface BenefitNode extends BenefitCircle {
  x: number;
  y: number;
}

@Component({
  selector: 'app-program-benefits',
  imports: [GsapReveal, ProgramAura],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-benefits.html',
  styleUrl: './program-benefits.scss',
})
export class ProgramBenefits implements AfterViewInit, OnDestroy {
  @ViewChild('section', { static: true }) private section!: ElementRef<HTMLElement>;

  private ctx?: gsap.Context;

  readonly introParagraphs: string[] = [
    'Designed with early-childhood experts, our Parent Toddler Program supports your child\u2019s cognitive, physical, language and social growth, all through play and guided by trained educators.',
    'Built for toddlers aged 6 months to 2 years, sessions run over several weeks so your child grows confident enough to move into preschool later. Along the way, you learn how to engage your toddler meaningfully too.',
  ];

  private readonly circles: BenefitCircle[] = [
    { text: 'Quality time together, just for the two of you', accent: '#eb2027' },
    { text: 'A gentle first step into a social, group setting', accent: '#f69220' },
    { text: 'Practical tips to engage your toddler meaningfully', accent: '#e0a800' },
    { text: "A close-up view of your child's development", accent: '#2f9e44' },
    { text: 'A smoother transition into preschool later on', accent: '#006fb9' },
    { text: 'A chance to bond with other like-minded parents', accent: '#874d3e' },
  ];

  // Evenly spaced around a circle, starting at 12 o'clock.
  readonly nodes: BenefitNode[] = this.circles.map((circle, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / this.circles.length;
    return {
      ...circle,
      x: Number((50 + 35 * Math.cos(angle)).toFixed(2)),
      y: Number((50 + 35 * Math.sin(angle)).toFixed(2)),
    };
  });

  constructor() {
    registerGsap();
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) {
      return;
    }

    this.ctx = gsap.context(() => {
      gsap.to('.ptt-orbit__ring', { rotation: 360, duration: 60, repeat: -1, ease: 'none' });

      gsap.fromTo(
        '.ptt-core__pulse',
        { scale: 0.85, autoAlpha: 0.7 },
        { scale: 1.7, autoAlpha: 0, duration: 2.6, repeat: -1, ease: 'power1.out' },
      );

      gsap.to('.ptt-node', {
        y: -7,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.35, from: 'random' },
      });
    }, this.section.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
