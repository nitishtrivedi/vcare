import { Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

@Component({
  selector: 'app-about-us-story',
  imports: [ScrollReveal],
  templateUrl: './about-us-story.html',
  styleUrl: './about-us-story.scss',
})
export class AboutUsStory {
  readonly storyImage = 'assets/images/about-us/about-us-story.JPG';
}
