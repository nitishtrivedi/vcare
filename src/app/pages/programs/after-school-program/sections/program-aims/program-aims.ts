import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';
import { AimCard } from '../../../../../models/program.model';

@Component({
  selector: 'app-program-aims',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-aims.html',
  styleUrl: './program-aims.scss',
})
export class ProgramAims {
  readonly heading = 'What Our After School Program Aims At';

  readonly cards: AimCard[] = [
    {
      title: 'Explore New Interests',
      accent: '#EB2027',
      description:
        'From yoga and dance to art, chess and science experiments — children discover activities they rarely get to try in a regular school day, building confidence as they go.',
    },
    {
      title: 'Build Social & Life Skills',
      accent: '#3BB44A',
      description:
        'Interacting with peers and caring educators outside the classroom builds sharing, gratitude and hygiene habits — real-world skills, learned through everyday practice.',
    },
    {
      title: 'Learn Time Management',
      accent: '#006FB9',
      description:
        'A balanced daily routine of homework, guided play and quiet time teaches children to manage their own time — a skill that pays off well beyond after-school hours.',
    },
  ];
}
