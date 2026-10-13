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

interface AdvisoryMember {
  name: string;
  role: string;
  initials: string;
  image: string;
  description: string;
  accent: string;
}

@Component({
  selector: 'app-about-us-school-advisory',
  imports: [GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us-school-advisory.html',
  styleUrl: './about-us-school-advisory.scss',
})
export class AboutUsSchoolAdvisory implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) private root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  readonly advisors: AdvisoryMember[] = [
    {
      name: 'Mr. M. S. Maheshgauri',
      role: 'IPS',
      initials: 'MM',
      image: 'assets/images/about-us/advisory/maheshgauri.jpg',
      accent: '#082a50',
      description:
        'A senior Indian Police Service (IPS) officer of the Maharashtra cadre. He has served in key leadership roles, including Joint Commissioner of Police, Pune, where he handled important administrative and operational responsibilities. His career includes involvement in high-level police administration, engagement on issues such as illicit liquor control, and participation in matters related to transfers and departmental proceedings, as reflected in official records and reports since the early 2000s.',
    },
    {
      name: 'Mr. Deepak Shah',
      role: 'Advisory Board Member',
      initials: 'DS',
      image: 'assets/images/about-us/deepak-shah.jpeg',
      accent: '#176fae',
      description:
        'Distinguished entrepreneur, industrialist, and philanthropist with 40+ years of societal service. Postgraduate in science; MBA. Secretary, Kamala Education Society; founded and managed Pratibha Group of Institutes and CBSE-pattern residential schools (primary to professional levels) serving 6,000+ students. Awards: G.S. Parkhe Industrial Award; Best Small Industrialist Award; Udyog Excellence Gold Medal. Social welfare: 30+ years with Lions Club of Talegaon; established computer labs in schools; helped set up two eye hospitals in Chakan and Shrirampur. Unanimously elected District Governor, Lions Clubs International, District 323-D2 (1999–2000). Key contributor to Jain Tirth – Shri Parshva Pradnyalay.',
    },
    {
      name: 'Mr. Shailesh Shah',
      role: 'Advisory Board Member',
      initials: 'SS',
      image: 'assets/images/about-us/shailesh-shah.jpeg',
      accent: '#1f7a5f',
      description:
        'A community-driven stalwart behind the success story of the Namrata Group. From a small cloth shop to impactful real estate developments and meaningful social programs, the journey reflects unwavering dedication to excellence and empathy. Beyond real estate, Mr. Shailesh Shah actively contributes to the education sector and is associated with initiatives at Choksey School, reflecting the group’s long-standing commitment to community development and holistic growth.',
    },
    {
      name: 'Mrs. Kajal Vora',
      role: 'Franchise Model Expert',
      initials: 'KV',
      image: 'assets/images/about-us/kajal-vora.jpeg',
      accent: '#e77b30',
      description: 'Kajal Vora',
    },
  ];

  readonly failed = signal<ReadonlySet<string>>(new Set());
  readonly expanded = signal<ReadonlySet<string>>(new Set());

  constructor() {
    registerGsap();
  }

  markFailed(name: string): void {
    this.failed.update((set) => new Set(set).add(name));
  }

  isOpen(name: string): boolean {
    return this.expanded().has(name);
  }

  toggle(name: string): void {
    this.expanded.update((set) => {
      const next = new Set(set);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  ngAfterViewInit(): void {
    if (prefersReducedMotion()) return;

    this.ctx = gsap.context(() => {
      gsap.from('[data-adv]', {
        autoAlpha: 0,
        y: 44,
        scale: 0.96,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-adv-grid]', start: 'top 82%' },
      });
    }, this.root.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
