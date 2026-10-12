import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GsapReveal } from '../../../../../directives/gsap-reveal';
import { ProgramAura } from '../program-aura/program-aura';

interface Fact {
  icon: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-program-facts',
  imports: [RouterLink, GsapReveal, ProgramAura],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-facts.html',
  styleUrl: './program-facts.scss',
})
export class ProgramFacts {
  readonly facts: Fact[] = [
    { icon: '◔', label: 'Age', value: '6 months – 2 years' },
    { icon: '◷', label: 'Duration', value: '1 hour, twice a week' },
  ];
}
