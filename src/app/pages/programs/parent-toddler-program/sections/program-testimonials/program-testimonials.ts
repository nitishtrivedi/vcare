import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

interface ParentTestimonial {
  quote: string;
  name: string;
  relation: string;
  initials: string;
  accent: string;
}

@Component({
  selector: 'app-program-testimonials',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-testimonials.html',
  styleUrl: './program-testimonials.scss',
})
export class ProgramTestimonials {
  readonly heading = 'Our Happy Parents';

  // Placeholder quotes — replace with real, permissioned parent testimonials
  // before launch. Keep at 6 or fewer — the track renders the array twice
  // for a seamless loop, so more items means a longer, slower-feeling loop.
  readonly testimonials: ParentTestimonial[] = [
    {
      quote:
        '[Placeholder \u2014 a parent quote about bonding time with their toddler during sessions.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#EB2027',
    },
    {
      quote:
        '[Placeholder \u2014 a parent quote about tips they picked up for engaging their toddler.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#F69220',
    },
    {
      quote:
        '[Placeholder \u2014 a parent quote about their toddler warming up to a group setting.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#3BB44A',
    },
    {
      quote: '[Placeholder \u2014 a parent quote about the educators guiding the sessions.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#006FB9',
    },
    {
      quote: '[Placeholder \u2014 a parent quote about noticing developmental milestones.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#874D3E',
    },
    {
      quote: '[Placeholder \u2014 a parent quote recommending the program to other parents.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#082A50',
    },
  ];

  //readonly loopTestimonials = [...this.testimonials, ...this.testimonials];
}
