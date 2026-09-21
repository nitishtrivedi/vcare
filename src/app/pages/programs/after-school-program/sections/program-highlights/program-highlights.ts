import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';
import { HighlightItem } from '../../../../../models/program.model';

@Component({
  selector: 'app-program-highlights',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-highlights.html',
  styleUrl: './program-highlights.scss',
})
export class ProgramHighlights {
  readonly heading = 'A Well-Rounded Day, Every Day';

  readonly items: HighlightItem[] = [
    {
      title: 'Move & Groove',
      subtitle: 'Yoga, Dance, Sports, Motor Skills',
      accent: '#EB2027',
      icon: 'move',
    },
    {
      title: 'Art Horizon',
      subtitle: 'Drawing, Craft, Origami, Color Play',
      accent: '#F69220',
      icon: 'art',
    },
    {
      title: 'Logic & Literacy',
      subtitle: 'Vedic Maths, Abacus, Phonics, Storytelling',
      accent: '#3BB44A',
      icon: 'logic',
    },
    {
      title: 'Life Readiness',
      subtitle: 'Sharing, Gratitude, Hygiene, Safety',
      accent: '#006FB9',
      icon: 'life',
    },
    {
      title: 'Milk & Snacks',
      subtitle: 'Healthy eating, table manners, hygiene',
      accent: '#874D3E',
      icon: 'meal',
    },
  ];
}
