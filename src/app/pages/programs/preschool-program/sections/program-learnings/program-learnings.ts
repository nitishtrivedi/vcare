import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';
import { DetailRow, LearningChip } from '../../../../../models/program.model';

@Component({
  selector: 'app-program-learnings',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-learnings.html',
  styleUrl: './program-learnings.scss',
})
export class ProgramLearnings {
  readonly chips: LearningChip[] = [
    { label: 'Language & Literacy' },
    { label: 'Art & Creativity' },
    { label: 'Math & Logic' },
    { label: 'Physical Development' },
    { label: 'Values & Life Skills' },
    { label: 'Brain & Tech Skills' },
    { label: 'Music & Movement' },
    { label: 'Healthy Eating' },
  ];

  readonly introParagraphs: string[] = [
    `At V Care, we believe every child learns best through real-world, hands-on experience. Our Preschool Program blends the Finnish Educare model, Reggio Emilia and Montessori practices with the Early Years Learning Framework — nurturing confident, creative and self-aware learners.`,
    `Every activity is designed to build a strong sense of identity, curiosity and wellbeing, preparing your child for a smooth transition into formal schooling.`,
  ];

  readonly detailRows: DetailRow[] = [
    {
      icon: 'duration',
      accent: '#F69220',
      title: 'Duration',
      description:
        'The Preschool Program runs for 3 to 5 hours a day depending on the class chosen, with flexible Daycare add-on hours available for working parents.',
    },
    {
      icon: 'routine',
      accent: '#3BB44A',
      title: 'Balanced Routine & Meals',
      description:
        'A gentle mix of guided learning, art & craft, storytime, outdoor play and quiet rest — with mindful eating routines coordinated with parents for every child\u2019s dietary needs.',
    },
    {
      icon: 'safety',
      accent: '#006FB9',
      title: 'Safe & Caring Environment',
      description:
        'CCTV-monitored, hygienic spaces, soft flooring and age-appropriate play areas — supported by trained, loving educators who make every child feel secure and understood.',
    },
  ];
}
