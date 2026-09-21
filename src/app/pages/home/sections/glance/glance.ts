import { Component } from '@angular/core';
import { ScrollReveal } from '../../../../directives/scroll-reveal';

interface Stat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-glance',
  imports: [ScrollReveal],
  templateUrl: './glance.html',
  styleUrl: './glance.scss',
})
export class Glance {
  // Placeholder numbers — replace with your real figures before launch.
  readonly stats: Stat[] = [
    { value: '150+', label: 'Happy Children' },
    { value: '10+', label: 'Activities & Programs' },
    { value: '5+', label: 'Years of Care' },
    { value: '15+', label: 'Expert Educators' },
    { value: '100%', label: 'Parent Satisfaction' },
  ];
}
