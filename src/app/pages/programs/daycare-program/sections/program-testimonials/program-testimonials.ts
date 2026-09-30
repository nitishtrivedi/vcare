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
      quote:
        'Daycare was a big decision for us because we wanted Ved to feel comfortable and cared for even when we werent around. VCare gave us that confidence from the very beginning. The teachers understand his little habits, know when he needs rest and make sure he stays engaged through the day. What makes me happiest is that Ved actually looks forward to going. As a working mother, knowing that my child is happy and secure during the day gives me immense peace of mind.',
      name: 'Neha Patil',
      relation: 'Parent of Ved',
      initials: 'NP',
      accent: '#EB2027',
    },
    {
      quote:
        'What I appreciate most about VCare is the personal attention they give to the children. Arjun is quite particular about his food and used to struggle with routines, but the team has handled everything with so much patience. They keep us updated about how his day went, which makes a huge difference. It doesnt feel like we are leaving him at a daycare; it genuinely feels like leaving him with people who know and care about him.',
      name: 'Richa Malhotra',
      relation: 'Parent of Arjun',
      initials: 'RM',
      accent: '#F69220',
    },
    {
      quote:
        'We chose VCare because we wanted something more than just childcare while we were at work. Ira gets a proper routine, plenty of playtime and different activities throughout the day. We have noticed such a lovely change in her confidence and independence since she joined. She has also made some sweet little friendships there. For us, the biggest sign that we made the right decision is seeing her happily walk in every morning.',
      name: 'Swati Bhide',
      relation: 'Parent of Ira',
      initials: 'SB',
      accent: '#3BB44A',
    },
    {
      quote:
        'Being a working parent comes with its own challenges, and finding a dependable daycare made a huge difference to our family. VCare has been extremely supportive and flexible with Riaan’s routine. I especially appreciate how approachable the teachers are whenever I have a question or concern. Riaan has become more social, expressive and comfortable doing little things on his own. We feel that he is growing in a very positive environment.',
      name: 'Divya Krishnan',
      relation: 'Parent of Riaan',
      initials: 'DK',
      accent: '#006FB9',
    },
    {
      quote:
        'Siya joined VCare when she was still very attached to me, so naturally I was worried about how she would adjust. The transition took some time, but the teachers were incredibly patient and never rushed her. Today she happily settles in, plays with her friends and gets involved in the activities. That change has been very emotional for me to watch. VCare has helped her become more confident without taking away that sense of comfort and security.',
      name: 'Pooja Deshmukh',
      relation: 'Parent of Siya',
      initials: 'PD',
      accent: '#874D3E',
    },
    {
      quote:
        'One thing that really stands out about VCare is that the children are not simply kept busy throughout the day. There is a nice balance of learning, play, rest and creative activities. Vihaan comes home talking about what he did, which tells us how much he enjoys his time there. I also appreciate the communication with parents and the fact that the team pays attention to the small things. It has made daycare feel like a natural extension of home for us.',
      name: 'Meera Menon',
      relation: 'Parent of Vihaan',
      initials: 'PN',
      accent: '#082A50',
    },
  ];

  //readonly loopTestimonials = [...this.testimonials, ...this.testimonials];
}
