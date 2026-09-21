import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';
import { FactItem } from '../../../../../models/program.model';

@Component({
  selector: 'app-program-facts',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-facts.html',
  styleUrl: './program-facts.scss',
})
export class ProgramFacts {
  readonly intro =
    'Children are introduced to a rotating mix of activities led by trained educators — keeping them active, curious and engaged, all under one roof, so parents don\u2019t need to juggle separate classes across town.';

  readonly facts: FactItem[] = [
    { icon: 'age', label: 'Age', value: '6 months \u2013 8 years' },
    { icon: 'timing', label: 'Timings', value: '2:00 PM \u2013 7:00 PM' },
    { icon: 'days', label: 'Days', value: 'Mon \u2013 Sat*' },
  ];
}
