import { Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-us-hero',
  imports: [ScrollReveal, RouterLink],
  templateUrl: './about-us-hero.html',
  styleUrl: './about-us-hero.scss',
})
export class AboutUsHero {
  readonly heroImage = 'assets/images/about-us/about-us-hero.JPG';
}
