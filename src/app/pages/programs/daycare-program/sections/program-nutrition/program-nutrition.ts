import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

@Component({
  selector: 'app-program-nutrition',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-nutrition.html',
  styleUrl: './program-nutrition.scss',
})
export class ProgramNutrition {
  readonly whyItMatters: string[] = [
    'Fuels active play and learning',
    'Supports brain development and focus',
    'Builds immunity and growth',
    'Encourages independence in eating and trying new foods',
  ];

  readonly parentPartnership: string[] = [
    'Share dietary needs / allergies with us',
    'Follow healthy eating at home to reinforce habits',
    'Pack simple, wholesome foods if sending meals from home',
  ];
}
