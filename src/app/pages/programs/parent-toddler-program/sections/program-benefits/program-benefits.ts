import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';
import { BenefitCircle } from '../../../../../models/program.model';

@Component({
  selector: 'app-program-benefits',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-benefits.html',
  styleUrl: './program-benefits.scss',
})
export class ProgramBenefits {
  readonly heading = 'At Our Parent Toddler Program';

  readonly circles: BenefitCircle[] = [
    { text: 'Quality time together, just for the two of you', accent: '#EB2027' },
    { text: 'A gentle first step into a social, group setting', accent: '#F69220' },
    { text: 'Practical tips to engage your toddler meaningfully', accent: '#FBED21' },
    { text: "A close-up view of your child's development", accent: '#3BB44A' },
    { text: 'A smoother transition into preschool later on', accent: '#006FB9' },
    { text: 'A chance to bond with other like-minded parents', accent: '#874D3E' },
  ];

  readonly introParagraphs: string[] = [
    'Designed with early-childhood experts, our Parent Toddler Program supports your child\u2019s cognitive, physical, language and social growth — all through play, guided by trained educators.',
    'Built for toddlers aged 6 months to 2 years, sessions run over several weeks so your child feels confident enough to eventually transition into preschool without the comfort of a familiar face close by. Along the way, you learn how to engage your toddler meaningfully too.',
  ];
}
