import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GsapReveal } from '../../../../../directives/gsap-reveal';
import { ProgramAura } from '../program-aura/program-aura';

interface ParentTestimonial {
  quote: string;
  name: string;
  relation: string;
  initials: string;
  accent: string;
}

@Component({
  selector: 'app-program-testimonials',
  imports: [RouterLink, GsapReveal, ProgramAura],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-testimonials.html',
  styleUrl: './program-testimonials.scss',
})
export class ProgramTestimonials {
  // Replace with real, permissioned parent quotes before launch.
  readonly testimonials: ParentTestimonial[] = [
    {
      quote:
        'Joining VCare’s Mother Toddler Program has been such a beautiful experience for both of us. Myra was initially a little shy around other children, but slowly she started participating, exploring and making friends. I love that the program gives us a chance to learn and play together rather than simply leaving her in a classroom. It has brought us even closer.',
      name: 'Priyanka Jadhav',
      relation: 'Parent of Myra',
      initials: 'PJ',
      accent: '#eb2027',
    },
    {
      quote:
        'We wanted Advik to get comfortable in a school environment without pressure. The Mother Toddler Program at VCare has been a wonderful introduction. The activities are playful, age-appropriate and let children explore at their own pace. He has become much more expressive and confident, and now gets excited whenever I say it’s time for school.',
      name: 'Nidhi Sharma',
      relation: 'Parent of Advik',
      initials: 'NS',
      accent: '#f69220',
    },
    {
      quote:
        'As a mother, watching your little one take those first steps towards independence is emotional. VCare has made that journey special for us. Aarohi loves the music, sensory activities and group play, and I enjoy being part of these experiences with her. The teachers are extremely patient and understand that every child has their own pace.',
      name: 'Sneha Iyer',
      relation: 'Parent of Aarohi',
      initials: 'SI',
      accent: '#2f9e44',
    },
    {
      quote:
        'What I love about VCare’s Mother Toddler Program is that it doesn’t feel like formal schooling. It is about learning through play, exploration and interaction while having a parent beside you. Kabir has become much more comfortable around other children and has started expressing himself more confidently. It has been a lovely beginning to his learning journey.',
      name: 'Amruta Kulkarni',
      relation: 'Parent of Kabir',
      initials: 'AK',
      accent: '#006fb9',
    },
    {
      quote:
        'When we were looking for a Mother Toddler Program in Pune, we wanted something focused on overall development rather than academics. VCare felt right from the start. Kiara enjoys every session, and I love being involved in her little discoveries. The teachers are warm, encouraging and very understanding. These sessions have given us memories I will always treasure.',
      name: 'Harpreet Kaur',
      relation: 'Parent of Kiara',
      initials: 'HK',
      accent: '#874d3e',
    },
    {
      quote:
        'Anvi was hesitant when she first started interacting with other children, so we tried a Mother Toddler Program before preschool. VCare has helped her come out of her shell beautifully. She now participates in activities, sings along, plays with others and is far more confident. I appreciate that the teachers never force anything and let every child settle in naturally.',
      name: 'Lakshmi Narayanan',
      relation: 'Parent of Anvi',
      initials: 'LN',
      accent: '#e0a800',
    },
  ];

  onPointerMove(event: PointerEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }
}
