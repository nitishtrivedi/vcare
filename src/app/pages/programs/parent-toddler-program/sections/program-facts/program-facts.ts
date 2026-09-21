import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';
import { RouterLink } from '@angular/router';
import { FactItem } from '../../../../../models/program.model';

@Component({
  selector: 'app-program-facts',
  imports: [RouterLink, ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-facts.html',
  styleUrl: './program-facts.scss',
})
export class ProgramFacts {
  readonly facts: FactItem[] = [
    { icon: 'age', label: 'Age', value: '6 months \u2013 2 years' },
    { icon: 'duration', label: 'Duration', value: '1 hour, twice a week' },
  ];
}
