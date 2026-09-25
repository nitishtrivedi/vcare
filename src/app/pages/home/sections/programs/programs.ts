import { Component, computed, signal } from '@angular/core';
import { ScrollReveal } from '../../../../directives/scroll-reveal';
import { RouterLink } from '@angular/router';

interface Program {
  name: string;
  tagline: string;
  age: string;
  copy: string;
  accent: string;
  image: string;
  routerLink: string;
  fragment?: string;
}

//const PAGE_SIZE = 3;
const WINDOW_SIZE = 3;

@Component({
  selector: 'app-programs',
  imports: [ScrollReveal, RouterLink],
  templateUrl: './programs.html',
  styleUrl: './programs.scss',
})
export class Programs {
  readonly programs: Program[] = [
    {
      name: 'Mother Toddler',
      tagline: 'Program',
      age: '1 – 2 years',
      copy: 'Gentle, parent-alongside sessions built on music, sensory play and early bonding.',
      accent: 'red',
      image: 'assets/images/programs/mother-toddler.png',
      routerLink: '/programs/parent-toddler-program',
    },
    {
      name: 'Preschool Program',
      tagline: 'Program',
      age: '2 – 6 years',
      copy: 'A joyful, thoughtfully designed learning journey where children grow through play, discovery, creativity and confident exploration.',
      accent: 'red',
      image: 'assets/images/programs/mother-toddler.png',
      routerLink: '/programs/preschool-program',
    },
    // {
    //   name: 'Playgroup',
    //   tagline: 'Program',
    //   age: '2 – 3 years',
    //   copy: 'The first step into structured play — turn-taking, basic routines and group comfort.',
    //   accent: 'orange',
    //   image: 'assets/images/programs/playgroup.png',
    //   routerLink: '/programs/preschool-program',
    //   fragment: 'classes',
    // },
    // {
    //   name: 'Nursery',
    //   tagline: 'Program',
    //   age: '3 – 4 years',
    //   copy: 'Language, number sense and creative expression through hands-on discovery.',
    //   accent: 'green',
    //   image: 'assets/images/programs/nursery.png',
    //   routerLink: '/programs/preschool-program',
    //   fragment: 'classes',
    // },
    // {
    //   name: 'Junior KG',
    //   tagline: 'Program',
    //   age: '4 – 5 years',
    //   copy: 'Early reading, writing and number skills taught through stories and play.',
    //   accent: 'blue',
    //   image: 'assets/images/programs/junior-kg.png',
    //   routerLink: '/programs/junior-kg',
    // },
    // {
    //   name: 'Senior KG',
    //   tagline: 'Program',
    //   age: '5 – 6 years',
    //   copy: 'Advanced learning and school-readiness skills to prepare for Grade 1.',
    //   accent: 'brown',
    //   image: 'assets/images/programs/senior-kg.png',
    //   routerLink: '/programs/senior-kg',
    // },
    {
      name: 'After School',
      tagline: 'Program',
      age: '2 – 10 years',
      copy: 'A safe, engaging space after school hours — sports, art and homework support.',
      accent: 'tan',
      image: 'assets/images/programs/after-school.png',
      routerLink: '/programs/after-school-program',
    },
    {
      name: 'Activity Center',
      tagline: 'Program',
      age: '6 Months – 10 years',
      copy: 'A safe, engaging space for your toddler, with safe and hygenic environment',
      accent: 'tan',
      image: 'assets/images/programs/after-school.png',
      routerLink: '/programs/daycare-program',
    },
  ];

  // /** Index of the current PAGE (0, 1, 2…), not the current card */
  // readonly page = signal(0);

  // readonly totalPages = computed(() => Math.ceil(this.programs.length / PAGE_SIZE));

  // /** The 3 (or fewer, on the last page) cards to show right now */
  // readonly visible = computed(() => {
  //   const start = this.page() * PAGE_SIZE;
  //   return this.programs.slice(start, start + PAGE_SIZE);
  // });

  // next(): void {
  //   this.page.update((p) => (p + 1) % this.totalPages());
  // }

  // prev(): void {
  //   this.page.update((p) => (p - 1 + this.totalPages()) % this.totalPages());
  // }

  /** Index of the FIRST visible card in the sliding window (0-based, wraps around) */
  readonly startIndex = signal(0);

  /** The 3 (or fewer, if there aren't 3 programs yet) cards to show right now,
   *  wrapping back to the start of the list once the window runs off the end. */
  readonly visible = computed(() => {
    const total = this.programs.length;
    const count = Math.min(WINDOW_SIZE, total);
    const start = this.startIndex();

    return Array.from({ length: count }, (_, i) => this.programs[(start + i) % total]);
  });

  next(): void {
    this.startIndex.update((i) => (i + 1) % this.programs.length);
  }

  prev(): void {
    this.startIndex.update((i) => (i - 1 + this.programs.length) % this.programs.length);
  }
}
