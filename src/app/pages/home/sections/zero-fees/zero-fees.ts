import { Component } from '@angular/core';
import { ScrollReveal } from '../../../../directives/scroll-reveal';
import { RouterLink } from '@angular/router';

interface Promise {
  text: string;
  number: number;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

interface ComparisonRow {
  traditional: string;
  vcare: string;
}

@Component({
  selector: 'app-zero-fees',
  imports: [ScrollReveal, RouterLink],
  templateUrl: './zero-fees.html',
  styleUrl: './zero-fees.scss',
})
export class ZeroFees {
  readonly promises: Promise[] = [
    { number: 3, text: 'ZERO tuition fees' },
    { number: 100, text: 'Your money remains your asset' },
    { number: 100, text: '100% safe and worry-free education' },
  ];

  readonly steps: Step[] = [
    {
      number: '1',
      title: 'Admission',
      description: 'Enrol at Playgroup (age 2+) and no monthly or annual tuition fees after that.',
    },
    {
      number: '2',
      title: '4-Year Journey',
      description:
        'Your child moves through Playgroup \u2192 Nursery \u2192 Junior KG \u2192 Senior KG, with zero tuition fees at every stage.',
    },
    {
      number: '3',
      title: '100% Satisfaction',
      description:
        'On completion of Senior KG, you receive a proper graduation certificate, just like any traditional preschool, but with the benefit of VCare ZERO Fees Model.',
    },
  ];

  readonly comparisonRows: ComparisonRow[] = [
    { traditional: 'Constant pressure of fees', vcare: 'Worry-free education for your child' },
    { traditional: 'LARGE sum of money, gone forever', vcare: 'Your money treated as your asset' },
    { traditional: 'Monthly stress', vcare: 'One-time clarity' },
    { traditional: 'No financial return', vcare: 'Capital preserved' },
  ];
}
