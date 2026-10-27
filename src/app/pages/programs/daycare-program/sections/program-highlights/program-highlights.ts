import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GsapReveal } from '../../../../../directives/gsap-reveal';

@Component({
  selector: 'app-program-highlights',
  imports: [GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-highlights.html',
  styleUrl: './program-highlights.scss',
})
export class ProgramHighlights {
  readonly themes = [
    'Wonders of the World',
    'Colour Scientist',
    'Community Helper',
    'Technology',
    'And many more…',
  ];

  readonly safety = [
    'CCTV cameras across the premises',
    'Child-safe flooring and doors',
    'Secured common entrance and exit',
  ];

  // Sets --mx / --my so the glow follows the pointer on each card.
  onPointerMove(event: PointerEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }
}
