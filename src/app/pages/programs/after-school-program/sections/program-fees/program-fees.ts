import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GsapReveal } from '../../../../../directives/gsap-reveal';

@Component({
  selector: 'app-program-fees',
  imports: [RouterLink, GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-fees.html',
  styleUrl: './program-fees.scss',
})
export class ProgramFees {
  readonly monthly = '₹1,500';
  readonly timing = '5:00 PM – 7:00 PM · 2 hours';

  readonly perks = [
    'Homework with guided support',
    'Creative art and craft',
    'Active play and movement',
    'Life-skills and values time',
  ];

  readonly discounts = ['10% off quarterly', '12% off half-yearly', '15% off yearly'];

  readonly note =
    'Fees are payable in advance, on or before the 5th of every month. Fees once paid are non-refundable but can be adjusted against other V Care programs.';
}
