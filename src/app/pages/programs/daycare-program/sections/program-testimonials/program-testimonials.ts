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
        'Daycare was a big decision for us because we wanted Ved to feel comfortable and cared for even when we weren’t around. VCare gave us that confidence from the very beginning. The teachers understand his little habits, know when he needs rest and keep him engaged through the day. What makes me happiest is that Ved actually looks forward to going. As a working mother, knowing my child is happy and secure gives me immense peace of mind.',
      name: 'Neha Patil',
      relation: 'Parent of Ved',
      initials: 'NP',
      accent: '#006fb9',
    },
    {
      quote:
        'What I appreciate most about VCare is the personal attention they give to the children. Arjun is quite particular about his food and used to struggle with routines, but the team has handled everything with so much patience. They keep us updated about his day, which makes a huge difference. It doesn’t feel like we are leaving him at a daycare; it feels like leaving him with people who truly know and care about him.',
      name: 'Richa Malhotra',
      relation: 'Parent of Arjun',
      initials: 'RM',
      accent: '#f69220',
    },
    {
      quote:
        'We chose VCare because we wanted something more than just childcare while we were at work. Ira gets a proper routine, plenty of playtime and different activities throughout the day. We have noticed a lovely change in her confidence and independence since she joined, and she has made some sweet friendships there. For us, the biggest sign that we made the right decision is seeing her happily walk in every morning.',
      name: 'Swati Bhide',
      relation: 'Parent of Ira',
      initials: 'SB',
      accent: '#2f9e44',
    },
    {
      quote:
        'Being a working parent comes with its own challenges, and finding a dependable daycare made a huge difference. VCare has been extremely supportive and flexible with Riaan’s routine. I especially appreciate how approachable the teachers are whenever I have a question or concern. Riaan has become more social, expressive and comfortable doing things on his own. We feel he is growing in a very positive environment.',
      name: 'Divya Krishnan',
      relation: 'Parent of Riaan',
      initials: 'DK',
      accent: '#006fb9',
    },
    {
      quote:
        'Siya joined VCare when she was still very attached to me, so I was naturally worried about how she would adjust. The transition took some time, but the teachers were incredibly patient and never rushed her. Today she settles in happily, plays with her friends and joins the activities. That change has been very emotional for me to watch. VCare has helped her grow more confident without taking away her sense of comfort and security.',
      name: 'Pooja Deshmukh',
      relation: 'Parent of Siya',
      initials: 'PD',
      accent: '#f69220',
    },
    {
      quote:
        'One thing that stands out about VCare is that the children are never simply kept busy. There is a nice balance of learning, play, rest and creative activities. Vihaan comes home talking about what he did, which tells us how much he enjoys his time there. I also appreciate the communication with parents and the way the team notices the small things. It feels like a natural extension of home.',
      name: 'Meera Menon',
      relation: 'Parent of Vihaan',
      initials: 'MM',
      accent: '#2f9e44',
    },
  ];

  onPointerMove(event: PointerEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }
}
