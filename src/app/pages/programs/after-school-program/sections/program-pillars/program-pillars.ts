import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GsapReveal } from '../../../../../directives/gsap-reveal';

interface Pillar {
  icon: string;
  title: string;
  description: string;
  accent: string;
}

interface Fact {
  value: string;
  label: string;
}

@Component({
  selector: 'app-program-pillars',
  imports: [GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-pillars.html',
  styleUrl: './program-pillars.scss',
})
export class ProgramPillars {
  readonly pillars: Pillar[] = [
    {
      icon: '✦',
      title: 'Explore new interests',
      description:
        'From yoga and dance to art, chess and science experiments, children discover activities they rarely get to try in a regular school day.',
      accent: '#d94c51',
    },
    {
      icon: '◎',
      title: 'Build social & life skills',
      description:
        'Time with peers and caring educators outside the classroom builds sharing, gratitude and hygiene habits through everyday practice.',
      accent: '#218768',
    },
    {
      icon: '◷',
      title: 'Learn to manage time',
      description:
        'A balanced routine of homework, guided play and quiet time teaches children to use their time well, a skill that lasts beyond the afternoon.',
      accent: '#176fae',
    },
  ];

  readonly facts: Fact[] = [
    { value: '6 mo – 8 yrs', label: 'Age range' },
    { value: '2:00 – 7:00 PM', label: 'Program window' },
    { value: 'Mon – Sat*', label: 'Weekly' },
  ];

  // Sets --mx / --my on the card so the hover glow follows the pointer.
  onPointerMove(event: PointerEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }
}
