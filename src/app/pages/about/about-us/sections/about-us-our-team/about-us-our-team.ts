import { Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

@Component({
  selector: 'app-about-us-our-team',
  imports: [ScrollReveal],
  templateUrl: './about-us-our-team.html',
  styleUrl: './about-us-our-team.scss',
})
export class AboutUsOurTeam {
  readonly teamPhoto = 'assets/images/about-us/team-vcare.JPG';
}
