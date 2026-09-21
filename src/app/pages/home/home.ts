import { Component } from '@angular/core';
import { Hero } from './sections/hero/hero';
import { CtaBanner } from './sections/cta-banner/cta-banner';
import { Testimonials } from './sections/testimonials/testimonials';
import { WhyUs } from './sections/why-us/why-us';
import { Glance } from './sections/glance/glance';
import { Programs } from './sections/programs/programs';
import { MediaBanner } from './sections/media-banner/media-banner';
import { ZeroFees } from './sections/zero-fees/zero-fees';

@Component({
  selector: 'app-home',
  imports: [Hero, Glance, Programs, WhyUs, Testimonials, CtaBanner, MediaBanner, ZeroFees],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
