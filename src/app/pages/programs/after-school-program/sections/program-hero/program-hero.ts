import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WaveDivider } from '../../../../../components/wave-divider/wave-divider';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

@Component({
  selector: 'app-program-hero',
  imports: [RouterLink, WaveDivider, ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-hero.html',
  styleUrl: './program-hero.scss',
})
export class ProgramHero {}
