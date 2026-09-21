import { Component } from '@angular/core';
import { ScrollReveal } from '../../../../directives/scroll-reveal';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta-banner',
  imports: [ScrollReveal, RouterLink],
  templateUrl: './cta-banner.html',
  styleUrl: './cta-banner.scss',
})
export class CtaBanner {
  readonly features = [
    'Small Batch Sizes',
    'Trained & Caring Educators',
    'Play-Based Curriculum',
    'Flexible Morning & Afternoon Batches',
  ];
}
