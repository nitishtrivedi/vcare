import { Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

@Component({
  selector: 'app-about-us-hero',
  imports: [ScrollReveal],
  templateUrl: './about-us-hero.html',
  styleUrl: './about-us-hero.scss',
})
export class AboutUsHero {
  readonly heroImage = 'assets/images/about-us/about-us-hero.JPG';
}
