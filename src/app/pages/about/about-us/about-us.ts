import { Component } from '@angular/core';
import { AboutUsHero } from './sections/about-us-hero/about-us-hero';
import { AboutUsLeadership } from './sections/about-us-leadership/about-us-leadership';
import { AboutUsOurTeam } from './sections/about-us-our-team/about-us-our-team';
import { AboutUsStory } from './sections/about-us-story/about-us-story';
import { AboutUsGallery } from './sections/about-us-gallery/about-us-gallery';
import { AboutUsMission } from './sections/about-us-mission/about-us-mission';
import { AboutUsTrust } from './sections/about-us-trust/about-us-trust';

@Component({
  selector: 'app-about-us',
  imports: [
    AboutUsHero,
    AboutUsLeadership,
    AboutUsOurTeam,
    AboutUsStory,
    AboutUsGallery,
    AboutUsMission,
    AboutUsTrust,
  ],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
})
export class AboutUs {}
