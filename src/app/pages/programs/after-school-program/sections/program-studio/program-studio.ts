import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GsapReveal } from '../../../../../directives/gsap-reveal';

interface StudioItem {
  icon: string;
  title: string;
  tags: string[];
  accent: string;
  wide: boolean;
}

@Component({
  selector: 'app-program-studio',
  imports: [GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-studio.html',
  styleUrl: './program-studio.scss',
})
export class ProgramStudio {
  readonly items: StudioItem[] = [
    {
      icon: '✦',
      title: 'Move & groove',
      tags: ['Yoga', 'Dance', 'Sports', 'Motor skills'],
      accent: '#d94c51',
      wide: true,
    },
    {
      icon: '✎',
      title: 'Art horizon',
      tags: ['Drawing', 'Craft', 'Origami', 'Colour play'],
      accent: '#e77b30',
      wide: true,
    },
    {
      icon: '∑',
      title: 'Logic & literacy',
      tags: ['Vedic maths', 'Abacus', 'Phonics', 'Storytelling'],
      accent: '#218768',
      wide: false,
    },
    {
      icon: '♡',
      title: 'Life readiness',
      tags: ['Sharing', 'Gratitude', 'Hygiene', 'Safety'],
      accent: '#176fae',
      wide: false,
    },
    {
      icon: '✿',
      title: 'Milk & snacks',
      tags: ['Healthy eating', 'Table manners', 'Hygiene'],
      accent: '#874d3e',
      wide: false,
    },
  ];

  onPointerMove(event: PointerEvent): void {
    const tile = event.currentTarget as HTMLElement;
    const rect = tile.getBoundingClientRect();
    tile.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    tile.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }
}
