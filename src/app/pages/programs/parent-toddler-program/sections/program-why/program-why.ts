import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';
import { WhyPoint } from '../../../../../models/program.model';

@Component({
  selector: 'app-program-why',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-why.html',
  styleUrl: './program-why.scss',
})
export class ProgramWhy {
  readonly heading = 'Why V Care Parent Toddler Program?';

  readonly points: WhyPoint[] = [
    {
      title: 'Open to any parent or caregiver \u2014 not limited to mothers',
      tint: '#FBD9DB',
      ring: '#EB2027',
    },
    {
      title: 'Dedicated, distraction-free time with your toddler',
      tint: '#FDE1C2',
      ring: '#F69220',
    },
    {
      title: 'Sensory play that sparks exploration and curiosity',
      tint: '#FFF6D2',
      ring: '#FBED21',
    },
    {
      title: 'Physical activities that support motor development',
      tint: '#D9F2DC',
      ring: '#3BB44A',
    },
    {
      title: 'Stimulates healthy brain growth in the critical early years',
      tint: '#C6EAD0',
      ring: '#3BB44A',
    },
    {
      title: 'Builds early language and social interaction skills',
      tint: '#D6E9F5',
      ring: '#006FB9',
    },
    {
      title: 'Eases the eventual transition into formal preschool',
      tint: '#E7D9D3',
      ring: '#874D3E',
    },
    {
      title: 'Connects you with other like-minded parents nearby',
      tint: '#CFE0EF',
      ring: '#082A50',
    },
  ];
}
