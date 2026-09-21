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
  // before launch. Keep this at 6 or fewer: the marquee track renders the
  // array twice back-to-back for a seamless loop, so more items = a much
  // longer, slower-feeling loop.
  readonly testimonials: ParentTestimonial[] = [
    {
      quote:
        '[Placeholder — a parent quote about how their child settled into the After School Program.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#EB2027',
    },
    {
      quote:
        '[Placeholder — a parent quote about a specific skill or habit their child picked up.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#F69220',
    },
    {
      quote: '[Placeholder — a parent quote about the educators or a memorable activity/event.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#3BB44A',
    },
    {
      quote:
        '[Placeholder — a parent quote about how convenient the program is for working parents.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child]',
      initials: 'PN',
      accent: '#006FB9',
    },
  ];

  readonly loopTestimonials = [...this.testimonials, ...this.testimonials];
}
