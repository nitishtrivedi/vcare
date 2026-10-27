import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { gsap, prefersReducedMotion } from './gsap-core';

let registered = false;

export function registerGsap(): void {
  if (registered) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger, prefersReducedMotion };
