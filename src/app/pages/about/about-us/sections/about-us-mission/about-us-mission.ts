import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

@Component({
  selector: 'app-about-us-mission',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-us-mission.html',
  styleUrl: './about-us-mission.scss',
})
export class AboutUsMission {}
