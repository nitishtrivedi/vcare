import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { GsapReveal } from '../../../../../directives/gsap-reveal';
import { gsap, prefersReducedMotion, registerGsap } from '../../../../../shared/motion/gsap-setup';

interface Leader {
  name: string;
  role: string;
  sectionLabel: string;
  initials: string;
  image: string;
  description: string;
  accent: string;
  reverse: boolean;
}

@Component({
  selector: 'app-about-us-leadership',
  imports: [GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us-leadership.html',
  styleUrl: './about-us-leadership.scss',
})
export class AboutUsLeadership implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  readonly leaders: Leader[] = [
    {
      name: 'Ms. Jinal H. Vora',
      role: 'Founder',
      sectionLabel: 'Our Founder',
      initials: 'JV',
      image: 'assets/images/about-us/jinal-vora.jpeg',
      accent: '#c93b41',
      reverse: false,
      description:
        'With close to two decades of experience in early childhood education, she has worked across leading school boards including ICSE, SSC, and IB, and brings diverse roles as an educator, curriculum developer, child counsellor and teacher trainer. Her vision for V Care is rooted in holistic, progressive education, nurturing confident communicators, empathetic individuals and reflective learners.',
    },
    {
      name: 'Mr. Bharat N. Vora',
      role: 'Director',
      sectionLabel: 'Director',
      initials: 'BV',
      image: 'assets/images/about-us/bharat-vora.jpeg',
      accent: '#176fae',
      reverse: true,
      description:
        'Mr. Bharat Vora plays a pivotal role in ensuring the smooth, thoughtful and day-to-day functioning of the centre. His leadership and organizational vision support a strong educational environment while ensuring that every aspect of the school remains focused on children, educators and families.',
    },
    {
      name: 'Mr. Rohit Nartekar',
      role: 'Functional Head',
      sectionLabel: 'Functional Head',
      initials: 'RN',
      image: '',
      accent: '#1f7a5f',
      reverse: false,
      description:
        'With a rich background as an educator and school leader, our Functional Head brings valuable experience and perspective to V Care. His guidance supports curriculum development, educational systems and the continuous growth of our teaching team.',
    },
  ];

  readonly failed = signal<ReadonlySet<string>>(new Set());

  constructor() {
    registerGsap();
  }

  markFailed(name: string): void {
    this.failed.update((set) => new Set(set).add(name));
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;

    this.ctx = gsap.context(() => {
      const rows = this.root.nativeElement.querySelectorAll<HTMLElement>('[data-lead]');

      rows.forEach((row) => {
        const dir = Number(row.dataset['dir'] ?? -1);

        gsap.from(row.querySelector('.ab-lead__copy'), {
          x: dir * 70,
          autoAlpha: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 80%' },
        });

        gsap.from(row.querySelector('.ab-lead__photo'), {
          x: -dir * 70,
          autoAlpha: 0,
          rotate: -dir * 3,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 80%' },
        });
      });
    }, this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
