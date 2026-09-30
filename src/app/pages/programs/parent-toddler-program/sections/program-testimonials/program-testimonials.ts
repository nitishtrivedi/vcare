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
        'Joining VCare’s Mother Toddler Program has been such a beautiful experience for both of us. Myra was initially a little shy around other children, but slowly she started participating, exploring and making friends. I love that the program gives us an opportunity to learn and play together rather than simply leaving the child in a classroom. It has brought us even closer and made her first step towards school a very happy one.',
      name: 'Priyanka Jadhav',
      relation: 'Parent of Myra',
      initials: 'PJ',
      accent: '#EB2027',
    },
    {
      quote:
        'We wanted Advik to get comfortable in a school environment without putting any pressure on him. The Mother Toddler Program at VCare has been a wonderful introduction. The activities are playful, age-appropriate and encourage children to explore at their own pace. I have noticed him becoming much more expressive and confident, and he now gets excited whenever I tell him it’s time for school.',
      name: 'Nidhi Sharma',
      relation: 'Parent of Advik',
      initials: 'NS',
      accent: '#F69220',
    },
    {
      quote:
        'As a mother, watching your little one take those first steps towards independence is emotional. VCare has made that journey very special for us. Aarohi loves the music, sensory activities and group play, and I enjoy being part of these experiences with her. The teachers are extremely patient and understand that every child has their own pace. We have genuinely cherished our time here.',
      name: 'Sneha Iyer',
      relation: 'Parent of Aarohi',
      initials: 'SI',
      accent: '#3BB44A',
    },
    {
      quote:
        'What I really love about VCare’s Mother Toddler Program is that it doesnt feel like formal schooling. It is about allowing children to learn through play, exploration and interaction while having their mother beside them. Kabir has become much more comfortable around other children and has started expressing himself more confidently. It has been such a lovely beginning to his learning journey.',
      name: 'Amruta Kulkarni',
      relation: 'Parent of Kabir',
      initials: 'AK',
      accent: '#006FB9',
    },
    {
      quote:
        'When we were looking for a Mother Toddler Program in Pune, we wanted something that focused on the child’s overall development rather than academics. VCare felt right from the beginning. Kiara enjoys every session, and I love being involved in her little discoveries and activities. The teachers are warm, encouraging and very understanding. These sessions have given us memories that I know I will always treasure.',
      name: 'Harpreet Kaur',
      relation: 'Parent of Kiara',
      initials: 'HK',
      accent: '#874D3E',
    },
    {
      quote:
        'Anvi was quite hesitant when she first started interacting with other children, so we decided to try a Mother Toddler Program before putting her into preschool. VCare has helped her come out of her shell beautifully. She now participates in activities, sings along, plays with other children and is much more confident. I especially appreciate how the teachers never force anything and allow every child to settle in naturally.',
      name: 'Lakshmi Narayanan',
      relation: 'Parent of Anvi',
      initials: 'PN',
      accent: '#082A50',
    },
  ];

  //readonly loopTestimonials = [...this.testimonials, ...this.testimonials];
}
