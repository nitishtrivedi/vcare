import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

interface TrustPoint {
  text: string;
}

@Component({
  selector: 'app-about-us-trust',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us-trust.html',
  styleUrl: './about-us-trust.scss',
})
export class AboutUsTrust {
  readonly trustedByParents: TrustPoint[] = [
    { text: '24×7 security guard & full CCTV surveillance' },
    { text: 'Daily sanitization, pest control & fumigation' },
    { text: 'Daily temperature checks & regular health checkups' },
    { text: 'Clean toys, equipment & child-friendly washrooms' },
    { text: 'Strict staff hygiene & safety protocols' },
    { text: 'Caring, trained educators' },
    { text: 'Structured day with learning + play' },
    { text: 'Safe, clean & child-friendly environment' },
  ];

  readonly insideVCare: TrustPoint[] = [
    { text: 'Carpeted classrooms' },
    { text: 'Child-friendly furniture' },
    { text: 'Clean toys and learning materials' },
    { text: 'Indoor play area' },
    { text: 'Indoor games' },
    { text: 'Sand pit zone' },
    { text: "Kids' swimming pool" },
    { text: 'Library books & reading corner' },
  ];
}
