import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

@Component({
  selector: 'app-program-moments',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-moments.html',
  styleUrl: './program-moments.scss',
})
export class ProgramMoments {
  readonly placeholders = Array.from({ length: 6 }, (_, i) => i + 1);
}
