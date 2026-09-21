import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

@Component({
  selector: 'app-program-mission',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-mission.html',
  styleUrl: './program-mission.scss',
})
export class ProgramMission {
  readonly paragraphOne =
    'At V Care, we nurture your child\u2019s curiosity, creativity, and confidence through a joyful blend of academics, arts, activities, and life skills.';

  readonly paragraphTwo =
    'Beyond strong values and character, our curriculum also equips them with communication and social skills that make them interview-ready for future milestones \u2014 even the next big promotion after daycare.';
}
