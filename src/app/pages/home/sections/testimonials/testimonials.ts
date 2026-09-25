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
      quote:
        'Choosing VCare for Dharwik has been one of the best decisions we made for his early years. What we really appreciate is the warm and caring environment. The teachers are patient, approachable and genuinely attentive to every child. We have seen Dharwik become more confident, independent and comfortable around other children. As parents, it gives us a lot of peace of mind knowing that he is happy and well cared for at VCare.',
      name: 'Yash Solanki',
      relation: 'Parent of Dharwik Solanki',
      initials: 'YS',
    },
    {
      quote:
        'Reeva has had such a wonderful experience at VCare. We love how the school focuses not only on academics but also on activities, creativity, communication and social development. The teachers make learning fun and ensure that every child gets attention. Reeva comes home excited to tell us about her day, which says a lot about how comfortable and happy she feels at school. We are really happy to be a part of the VCare family.',
      name: 'Sayali Kulkarni',
      relation: 'Parent of Reeva Kulkarni',
      initials: 'SK',
    },
    {
      quote:
        'Krishna has grown so much since joining VCare, and we have noticed a lovely change in his confidence and overall personality. The staff is very supportive and keeps parents informed about the child’s progress. We especially like the homely atmosphere and the way the teachers understand each child’s individual needs. VCare feels much more personal than a typical school, and that is something we truly value as parents.',
      name: 'Swati',
      relation: 'Parent of Krishna',
      initials: 'S',
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
