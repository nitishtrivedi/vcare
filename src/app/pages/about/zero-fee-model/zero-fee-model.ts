import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WaveDivider } from '../../../components/wave-divider/wave-divider';
import { ScrollReveal } from '../../../directives/scroll-reveal';

interface HeroStat {
  value: string;
  label: string;
}

interface PromisePoint {
  title: string;
  description: string;
  accent: string;
  icon: 'no-fee' | 'no-monthly' | 'no-hidden' | 'complete';
}

interface JourneyStep {
  number: string;
  title: string;
  description: string;
  tags?: string[];
}

interface TrustCard {
  title: string;
  accent: string;
  points: string[];
  icon: 'legal' | 'asset' | 'exit';
}

interface ComparisonRow {
  traditional: string;
  vcare: string;
}

@Component({
  selector: 'app-zero-fee-model',
  imports: [RouterLink, ScrollReveal, WaveDivider],
  templateUrl: './zero-fee-model.html',
  styleUrl: './zero-fee-model.scss',
})
export class ZeroFeeModel {
  readonly heroStats: HeroStat[] = [
    { value: 'No Registration Fees', label: 'Worry-free education' },
    { value: 'School Kits Delivered', label: 'Without ANY Charge' },
    { value: '4 Years', label: 'Playgroup \u2192 Senior KG' },
    { value: '\u20B90', label: 'Monthly tuition, ever' },
  ];

  readonly promises: PromisePoint[] = [
    {
      title: 'No Admission Fee',
      description: 'The admission fees under this model is entirely upto us!.',
      accent: '#EB2027',
      icon: 'no-fee',
    },
    {
      title: 'No Monthly Fee',
      description: 'Zero recurring tuition for the entire journey.',
      accent: '#F69220',
      icon: 'no-monthly',
    },
    {
      title: 'No Hidden Charges',
      description: 'What you agree to, is what you pay \u2014 nothing more.',
      accent: '#3BB44A',
      icon: 'no-hidden',
    },
    {
      title: 'Complete Learning Program',
      description: 'Full access to curriculum, facilities, materials and trained educators.',
      accent: '#006FB9',
      icon: 'complete',
    },
  ];

  readonly journeySteps: JourneyStep[] = [
    {
      number: '01',
      title: 'Admission',
      description:
        'Visit VCare Campus, lets have a discussion around our wonderful ZERO Fees model and enrol your child!',
    },
    {
      number: '02',
      title: 'The 4-Year Journey',
      description:
        'Your child progresses through every stage with zero monthly or annual tuition fees along the way.',
      tags: ['Playgroup', 'Nursery', 'Junior KG', 'Senior KG'],
    },
    {
      number: '03',
      title: '100% Satisfaction',
      description:
        'On completion of the entire preschool program, it is our VCare promise that no stone would be left unturned, and your child is ready for future endeavors in best way possible',
    },
  ];

  readonly trustCards: TrustCard[] = [
    {
      title: 'Legally Documented',
      accent: '#EB2027',
      icon: 'legal',
      points: [
        'Deposit agreement signed at admission',
        'Refund date, amount and terms clearly mentioned',
        'Fixed tenure \u2014 no conditions attached',
      ],
    },
    {
      title: 'Asset-Backed',
      accent: '#3BB44A',
      icon: 'asset',
      points: [
        'Backed by registered business operations',
        'Backed by tangible business assets',
        'Long-term sustainability planning',
      ],
    },
    {
      title: 'Early-Exit Protection',
      accent: '#006FB9',
      icon: 'exit',
      points: [
        'Pro-rated settlement if a child leaves mid-tenure',
        'Transparent, upfront exit clause',
        'Refund never depends on school performance or profits',
      ],
    },
  ];

  readonly comparisonRows: ComparisonRow[] = [
    { traditional: 'Constant pressure of fees', vcare: 'Worry-free education for your child' },
    {
      traditional: 'LARGE sum of money, gone forever',
      vcare: 'Your money treated as your asset',
    },
    { traditional: 'Monthly stress', vcare: 'One-time clarity' },
    { traditional: 'No financial return', vcare: 'Capital preserved' },
  ];

  readonly winPoints: string[] = [
    'Premium early education',
    'Financial discipline & predictability',
    'Zero fear of "wasted fees"',
    'A school that shares responsibility',
  ];
}
