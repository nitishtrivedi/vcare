import { Component } from '@angular/core';
import { ScrollReveal } from '../../../../directives/scroll-reveal';
import { RouterLink } from '@angular/router';

interface Point {
  title: string;
  icon: 'holistic' | 'hands-on' | 'feedback' | 'partnership' | 'team' | 'ratio' | 'cctv' | 'home';
}

@Component({
  selector: 'app-why-us',
  imports: [ScrollReveal, RouterLink],
  templateUrl: './why-us.html',
  styleUrl: './why-us.scss',
})
export class WhyUs {
  readonly points: Point[] = [
    { title: 'Holistic Development Of Children', icon: 'holistic' },
    { title: 'Hands-On Learning Through Play', icon: 'hands-on' },
    { title: 'Regular Feedback With Parents', icon: 'feedback' },
    { title: 'Strong Parent Partnership', icon: 'partnership' },
    { title: 'Trained & Caring Educators', icon: 'team' },
    { title: 'Small, Personal Batch Sizes', icon: 'ratio' },
    { title: 'CCTV-Monitored, Safe Premises', icon: 'cctv' },
    { title: 'A Home-Like Environment', icon: 'home' },
  ];
}
