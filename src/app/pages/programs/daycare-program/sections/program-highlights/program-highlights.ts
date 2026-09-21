import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';
import { HighlightCircle } from '../../../../../models/program.model';

interface FeatureCard {
  title: string;
  description: string;
  bullets?: string[];
  accent: string;
}

@Component({
  selector: 'app-program-highlights',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-highlights.html',
  styleUrl: './program-highlights.scss',
})
export class ProgramHighlights {
  readonly intro =
    'Everything at our Activity Centre is designed around one idea \u2014 that daycare should feel like a second home, not a waiting room.';

  readonly features: FeatureCard[] = [
    {
      title: 'Theme-Based Learning',
      description: 'Theme-based interactive learning includes themes such as:',
      bullets: [
        'Wonders of the World',
        'Color Scientist',
        'Community Helper',
        'Technology',
        'And many more\u2026',
      ],
      accent: '#F69220',
    },
    {
      title: 'Safe & Stimulating Environment',
      description:
        'Our space is child-friendly, hygienic and secure, with age-appropriate play areas and learning corners that spark curiosity. Safety measures include:',
      bullets: [
        'CCTV cameras',
        'Safety floor and doors',
        'Dedicated security with a common entrance and exit',
      ],
      accent: '#006FB9',
    },
    {
      title: 'Experienced & Caring Staff',
      description:
        'Our teachers and caregivers are trained and are experts in early childhood education. They are passionate about nurturing every child with patience, warmth and empathy.',
      accent: '#3BB44A',
    },
    {
      title: 'Fun + Learning = Happy Kids!',
      description:
        'From captivating story time and music to creative art and outdoor play, we thoughtfully balance structured learning with free exploration \u2014 making each day exciting and truly unforgettable.',
      accent: '#EB2027',
    },
  ];
}
