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

  readonly testimonials: ParentTestimonial[] = [
    {
      quote: '[Placeholder \u2014 a parent quote about how comfortable their child is at daycare.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#EB2027',
    },
    {
      quote: '[Placeholder \u2014 a parent quote about the meals or daily routine.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#F69220',
    },
    {
      quote: '[Placeholder \u2014 a parent quote about the caregivers\u2019 attentiveness.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#3BB44A',
    },
    {
      quote: '[Placeholder \u2014 a parent quote about peace of mind while at work.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#006FB9',
    },
    {
      quote:
        '[Placeholder \u2014 a parent quote about their child\u2019s development since joining.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#874D3E',
    },
    {
      quote: '[Placeholder \u2014 a parent quote recommending the daycare to other parents.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#082A50',
    },
  ];

  //readonly loopTestimonials = [...this.testimonials, ...this.testimonials];
}
