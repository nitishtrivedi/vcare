import { Component, computed, signal } from '@angular/core';
import { ScrollReveal } from '../../../../directives/scroll-reveal';
interface Testimonial {
  quote: string;
  name: string;
  relation: string;
  initials: string;
}
@Component({
  selector: 'app-testimonials',
  imports: [ScrollReveal],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials {
  // Placeholder quotes — replace with real, permissioned parent testimonials.
  readonly testimonials: Testimonial[] = [
    {
      quote: '[Placeholder — a parent quote about settling in and day-to-day comfort at V Care.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child], Playgroup',
      initials: 'PN',
    },
    {
      quote: '[Placeholder — a parent quote about a specific improvement noticed in their child.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child], Nursery',
      initials: 'PN',
    },
    {
      quote: '[Placeholder — a parent quote about the teachers or a memorable school event.]',
      name: '[Parent Name]',
      relation: 'Parent of [Child], Senior KG',
      initials: 'PN',
    },
  ];

  readonly index = signal(0);

  readonly current = computed(() => this.testimonials[this.index()]);

  next(): void {
    this.index.update((i) => (i + 1) % this.testimonials.length);
  }

  prev(): void {
    this.index.update((i) => (i - 1 + this.testimonials.length) % this.testimonials.length);
  }

  goTo(i: number): void {
    this.index.set(i);
  }
}
