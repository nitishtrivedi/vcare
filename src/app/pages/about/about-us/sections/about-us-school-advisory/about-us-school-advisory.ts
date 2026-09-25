import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

interface AdvisoryMember {
  name: string;
  role: string;
  initials: string;
  image: string;
  description: string;
  accent: string;
  colSpan?: number; // how many grid columns this card occupies (default 1)
  rowSpan?: number; // how many grid rows this card occupies (default 1)
}

@Component({
  selector: 'app-about-us-school-advisory',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us-school-advisory.html',
  styleUrl: './about-us-school-advisory.scss',
})
export class AboutUsSchoolAdvisory {
  readonly advisors: AdvisoryMember[] = [
    {
      name: 'Mr. M. S. Maheshgauri',
      role: 'IPS',
      initials: 'MM',
      image: 'assets/images/about-us/advisory/maheshgauri.jpg',
      accent: '#082A50', // navy-deep
      description:
        'A senior Indian Police Service (IPS) officer of the Maharashtra cadre. He has served in key leadership roles, including Joint Commissioner of Police, Pune, where he handled important administrative and operational responsibilities. His career includes involvement in high-level police administration, engagement on issues such as illicit liquor control, and participation in matters related to transfers and departmental proceedings, as reflected in official records and reports since the early 2000s.',
      colSpan: 1,
      rowSpan: 1,
    },
    {
      name: 'Mr. Deepak Shah',
      role: 'Advisory Board Member',
      initials: 'DS',
      image: 'assets/images/about-us/deepak-shah.jpeg',
      accent: '#006FB9', // blue
      description:
        'Distinguished entrepreneur, industrialist, and philanthropist with 40+ years of societal service. Postgraduate in science; MBA. Education: Secretary, Kamala Education Society; founded/managed Pratibha Group of Institutes and CBSE-pattern residential schools (primary to professional levels) serving 6,000+ students. Awards: G.S. Parkhe Industrial Award; Best Small Industrialist Award; Udyog Excellence Gold Medal. Social welfare: 30+ years with Lions Club of Talegaon; established computer labs in schools; helped set up two eye hospitals in Chakan and Shrirampur (Lions Club International Foundation support). Leadership: Unanimously elected District Governor, Lions Clubs International, District 323-D2 (1999–2000). Community impact: Key contributor to Jain Tirth – Shri Parshva Pradnyalay',
      colSpan: 1,
      rowSpan: 2,
    },
    {
      name: 'Mr. Shailesh Shah',
      role: 'Advisory Board Member',
      initials: 'SS',
      image: 'assets/images/about-us/shailesh-shah.jpeg',
      accent: '#2c8d38', // darkened green — WCAG-safe with white text, per mission.scss precedent
      description:
        'A community-driven stalwart behind the success story of the Namrata Group. From beginning with a small cloth shop to shaping impactful real estate developments and initiating meaningful social programs, the journey reflects unwavering dedication to excellence and empathy. With a strong blend of business acumen and social responsibility, the group continues to set benchmarks by creating spaces rooted in care, trust, and progress. Beyond real estate, Mr. Shailesh Shah actively contributes to the education sector and is associated with initiatives at Choksey School, reflecting the group’s long-standing commitment to community development and holistic growth.',
      colSpan: 1,
      rowSpan: 3,
    },
    {
      name: 'Mr. Anil Satpute',
      role: 'Advisory Board Member',
      initials: 'AS',
      image: 'assets/images/about-us/advisory/anil-satpute.jpg',
      accent: '#2c8d38', // darkened green — WCAG-safe with white text, per mission.scss precedent
      description: 'Anil Satpute',
      colSpan: 1,
      rowSpan: 4,
    },
  ];

  // Tracks which advisor photos failed to load, so only those fall back to initials.
  readonly brokenImages = new Set<number>();

  onImageError(index: number): void {
    this.brokenImages.add(index);
  }
}
