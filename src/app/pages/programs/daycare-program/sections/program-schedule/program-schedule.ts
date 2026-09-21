import { Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';
import { ScheduleBlock } from '../../../../../models/program.model';

const ACCENTS = ['#EB2027', '#F69220', '#3BB44A', '#006FB9', '#874D3E', '#FBED21'];

@Component({
  selector: 'app-program-schedule',
  imports: [ScrollReveal],
  templateUrl: './program-schedule.html',
  styleUrl: './program-schedule.scss',
})
export class ProgramSchedule {
  readonly heading = 'A Typical Day At Our Daycare';

  // Sourced from V Care's official "Daycare Monthly Overview" — durations only,
  // no fixed clock times were provided for this schedule.
  readonly blocks: ScheduleBlock[] = [
    { time: '30 Mins', label: 'Welcome & Circle Time', icon: 'circle', accent: ACCENTS[0] },
    {
      time: '30 Mins',
      label: 'Jolly Phonics & Guided Activities',
      icon: 'book',
      accent: ACCENTS[1],
    },
    { time: '15 Mins', label: 'Breakfast Time', icon: 'meal', accent: ACCENTS[2] },
    { time: '45 Mins', label: 'Art and Craft', icon: 'art', accent: ACCENTS[3] },
    { time: '90 Mins', label: 'Fun with Mathematics', icon: 'blocks', accent: ACCENTS[4] },
    { time: '30 Mins', label: 'Lunch Time', icon: 'meal', accent: ACCENTS[5] },
    { time: '30 Mins', label: 'Theme-Based Storytelling', icon: 'book', accent: ACCENTS[0] },
    { time: '90 Mins', label: 'Nap Time', icon: 'rest', accent: ACCENTS[1] },
    { time: '15 Mins', label: 'Quiet Play & Transition', icon: 'play', accent: ACCENTS[2] },
    { time: '15 Mins', label: 'Milk Time', icon: 'milk', accent: ACCENTS[3] },
    {
      time: '60 Mins',
      label: 'Brainy Way! Computer Education',
      icon: 'reflect',
      accent: ACCENTS[4],
    },
    { time: '30 Mins', label: 'Theme-based Physical Activities', icon: 'play', accent: ACCENTS[5] },
    { time: '30 Mins', label: 'Snacks Time', icon: 'snack', accent: ACCENTS[0] },
    { time: '30 Mins', label: 'Theme-based Moral Education', icon: 'group', accent: ACCENTS[1] },
    { time: '30 Mins', label: 'Life Skills', icon: 'table', accent: ACCENTS[2] },
  ];
}
