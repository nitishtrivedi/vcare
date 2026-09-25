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
        'Finding a safe and caring place for Aarav after school was always a concern for us, especially with both of us working. VCare has made that worry disappear. He gets time to relax, play, complete his homework and still participate in different activities. What touches us most is how warmly the teachers treat him. He looks forward to going there every day, and as parents, that means everything to us.',
      name: 'Amruta Deshmukh',
      relation: 'Parent of Aarav',
      initials: 'PN',
      accent: '#EB2027',
    },
    {
      quote:
        'We were initially looking for a simple after-school care option, but VCare turned out to be much more than that. Anaya gets individual attention, completes her homework with guidance and enjoys creative activities and playtime. We have noticed a big change in her confidence and independence. It feels reassuring to know that she is spending her afternoons in an environment where she is genuinely cared for',
      name: 'Rohit Bapat',
      relation: 'Parent of Anaya',
      initials: 'PN',
      accent: '#F69220',
    },
    {
      quote:
        'After school, children need more than just a place to stay, and that is exactly what we found at VCare. Ved gets a good balance of studies, play and activities, without feeling pressured. The teachers are patient and understanding, and they know when to encourage him and when to simply let him be a child. He comes home happy and talks about his day with so much excitement. That itself is the biggest testimonial for us.',
      name: 'Neha Kulkarni',
      relation: 'Parent of Ved',
      initials: 'PN',
      accent: '#3BB44A',
    },
    {
      quote:
        'VCare has been a wonderful support for our family. With our work schedules, we wanted a place where Ira would be safe, engaged and looked after with genuine care. The after-school team has been incredibly warm and attentive. She gets her homework done, enjoys activities and has made some lovely friendships. More importantly, she feels at home there. We are truly grateful to have found a place where our child is cared for beyond just academics.',
      name: 'Siddharth Joshi',
      relation: 'Parent of Ira',
      initials: 'PN',
      accent: '#006FB9',
    },
  ];

  readonly loopTestimonials = [...this.testimonials, ...this.testimonials];
}
