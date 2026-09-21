import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';
import { WaveDivider } from '../../../../../components/wave-divider/wave-divider';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-program-hero',
  imports: [RouterLink, WaveDivider, ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-hero.html',
  styleUrl: './program-hero.scss',
})
export class ProgramHero {}
