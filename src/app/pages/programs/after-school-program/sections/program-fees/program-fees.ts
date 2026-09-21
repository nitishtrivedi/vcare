import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';
import { RouterLink } from '@angular/router';
import { PricingTier } from '../../../../../models/program.model';

@Component({
  selector: 'app-program-fees',
  imports: [RouterLink, ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-fees.html',
  styleUrl: './program-fees.scss',
})
export class ProgramFees {
  readonly timing = '5:00 PM \u2013 7:00 PM (2 Hours)';
  readonly monthly = '\u20B91,500';

  readonly note =
    'Fees are payable in advance, on or before the 5th of every month. 10% discount on quarterly payment, 12% on half-yearly, 15% on yearly. Fees once paid are non-refundable but can be adjusted against other V Care programs.';
}
