import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

interface Leader {
  sectionLabel: string;
  role: string;
  name: string;
  initials: string;
  image: string;
  description: string;
  accent: string;
  imageSide: 'left' | 'right';
}

@Component({
  selector: 'app-about-us-leadership',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us-leadership.html',
  styleUrl: './about-us-leadership.scss',
})
export class AboutUsLeadership {
  readonly leaders: Leader[] = [
    {
      sectionLabel: 'Our Founder',
      role: 'Founder',
      name: 'Ms. Jinal H. Vora',
      initials: '',
      image: 'assets/images/about-us/jinal-vora.jpeg',
      accent: '#EB2027',
      imageSide: 'right',
      description:
        'With close to two decades of experience in early childhood education, she has worked across leading school boards including ICSE, SSC, and IB, and brings diverse roles as an educator, curriculum developer, child counsellor and teacher trainer. Her vision for V Care is rooted in holistic, progressive education — nurturing confident communicators, empathetic individuals and reflective learners.',
    },
    {
      sectionLabel: 'Director',
      role: 'Director',
      name: 'Mr. Bharat N. Vora',
      initials: '',
      image: 'assets/images/about-us/bharat-vora.jpeg',
      accent: '#006FB9',
      imageSide: 'left',
      description:
        'Mr. Bharat Vora plays a pivotal role in ensuring the smooth, thoughtful and day-to-day functioning of the centre. His leadership and organizational vision support a strong educational environment while ensuring that every aspect of the school remains focused on children, educators and families.',
    },
    {
      sectionLabel: 'Functional Head',
      role: 'Functional Head',
      name: 'Mr. Rohit Nartekar',
      initials: 'RN',
      image: '',
      accent: '#3BB44A',
      imageSide: 'right',
      description:
        'With a rich background as an educator and school leader, our Functional Head brings valuable experience and perspective to V Care. His guidance supports curriculum development, educational systems and the continuous growth of our teaching team.',
    },
  ];
}
