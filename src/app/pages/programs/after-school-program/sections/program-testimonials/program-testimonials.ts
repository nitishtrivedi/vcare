import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GsapReveal } from '../../../../../directives/gsap-reveal';

interface ParentTestimonial {
  quote: string;
  name: string;
  relation: string;
  initials: string;
  accent: string;
}

@Component({
  selector: 'app-program-testimonials',
  imports: [RouterLink, GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-testimonials.html',
  styleUrl: './program-testimonials.scss',
})
export class ProgramTestimonials {
  // Replace with real, permissioned parent quotes before launch.
  readonly testimonials: ParentTestimonial[] = [
    {
      quote:
        'Finding a safe and caring place for Aarav after school was always a concern for us, especially with both of us working. VCare has made that worry disappear. He gets time to relax, play, finish his homework and still join in activities. The teachers treat him warmly, and he looks forward to going every day. That means everything to us.',
      name: 'Amruta Deshmukh',
      relation: 'Parent of Aarav',
      initials: 'AD',
      accent: '#d94c51',
    },
    {
      quote:
        'We were looking for simple after-school care, but VCare turned out to be much more. Anaya gets individual attention, completes her homework with guidance and enjoys creative activities and playtime. We have seen a big change in her confidence and independence. It feels reassuring to know she spends her afternoons where she is genuinely cared for.',
      name: 'Rohit Bapat',
      relation: 'Parent of Anaya',
      initials: 'RB',
      accent: '#e77b30',
    },
    {
      quote:
        'After school, children need more than a place to stay, and that is exactly what we found at VCare. Ved gets a good balance of studies, play and activities without feeling pressured. The teachers are patient and know when to encourage him and when to simply let him be a child. He comes home happy and excited to talk about his day. That is our biggest testimonial.',
      name: 'Neha Kulkarni',
      relation: 'Parent of Ved',
      initials: 'NK',
      accent: '#218768',
    },
    {
      quote:
        'With our work schedules, we wanted a place where Ira would be safe, engaged and looked after with genuine care. The after-school team has been incredibly warm and attentive. She gets her homework done, enjoys activities and has made lovely friendships. More importantly, she feels at home there. We are truly grateful.',
      name: 'Siddharth Joshi',
      relation: 'Parent of Ira',
      initials: 'SJ',
      accent: '#176fae',
    },
  ];
}
