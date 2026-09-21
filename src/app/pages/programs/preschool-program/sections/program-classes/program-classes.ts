import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

interface ProgramSchedule {
  label: string;
  timing: string;
  duration: string;
  days: string;
  meals: string;
}

interface ProgramClass {
  name: string;
  color: string;
  eligibility: string;
  aims: string[];
  schedules: ProgramSchedule[];
}

@Component({
  selector: 'app-program-classes',
  imports: [RouterLink, ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-classes.html',
  styleUrl: './program-classes.scss',
})
export class ProgramClasses {
  // readonly classes: ProgramClass[] = [
  //   {
  //     name: 'Playgroup',
  //     color: '#EB2027',
  //     eligibility: '2 to 3 years',
  //     aims: [
  //       'Build independence and early self-help skills',
  //       'Foster social skills through guided play',
  //       'Develop fine and gross motor skills',
  //     ],
  //     half: {
  //       label: 'Morning Batch',
  //       timing: '8:30 AM \u2013 11:30 AM',
  //       duration: 'April \u2013 March',
  //       days: 'Mon \u2013 Fri',
  //       meals: 'Meal (from home)',
  //     },
  //     full: {
  //       label: 'Afternoon Batch',
  //       timing: '11:30 AM \u2013 2:30 PM',
  //       duration: '3 Hours',
  //       days: 'Mon \u2013 Fri',
  //       meals: 'Meal (from home)',
  //     },
  //   },
  //   {
  //     name: 'Nursery',
  //     color: '#F69220',
  //     eligibility: '3 to 4 years',
  //     aims: [
  //       'Learning through exploration and academic pre-readiness',
  //       'Build early phonics and expression',
  //       'Develop problem-solving through play',
  //     ],
  //     half: {
  //       label: 'Morning Batch',
  //       timing: '8:30 AM \u2013 11:30 AM',
  //       duration: 'April \u2013 March',
  //       days: 'Mon \u2013 Friday',
  //       meals: 'Meal (from home)',
  //     },
  //     full: {
  //       label: 'Afternoon Batch',
  //       timing: '11:30 AM \u2013 2:30 PM',
  //       duration: '3 Hours',
  //       days: 'Mon \u2013 Fri',
  //       meals: 'Meal (from home)',
  //     },
  //   },
  //   {
  //     name: 'Junior KG',
  //     color: '#3BB44A',
  //     eligibility: '4 to 5 years',
  //     aims: [
  //       'Strengthen logic and reasoning',
  //       'Increased focus on academic readiness',
  //       'Exposure to languages and general knowledge',
  //     ],
  //     half: {
  //       label: 'Day',
  //       timing: '9:15 AM \u2013 12:45 PM',
  //       duration: 'June \u2013 April',
  //       days: 'Mon \u2013 Sat',
  //       meals: 'Snack (from home)',
  //     },
  //     full: {
  //       label: 'Full Day (Daycare)',
  //       timing: '9:15 AM \u2013 5:15 PM+',
  //       duration: '2\u201310 hrs add-on',
  //       days: 'Mon \u2013 Sat',
  //       meals: 'Lunch & Snacks',
  //     },
  //   },
  //   {
  //     name: 'Senior KG',
  //     color: '#006FB9',
  //     eligibility: '5 to 6 years',
  //     aims: [
  //       'Prepare for primary and formal schooling',
  //       'Advanced academic and reasoning skills',
  //       'Build confidence and personality development',
  //     ],
  //     half: {
  //       label: 'Half Day',
  //       timing: '9:15 AM \u2013 12:45 PM',
  //       duration: 'June \u2013 April',
  //       days: 'Mon \u2013 Sat',
  //       meals: 'Snack (from home)',
  //     },
  //     full: {
  //       label: 'Full Day (Daycare)',
  //       timing: '9:15 AM \u2013 5:15 PM+',
  //       duration: '2\u201310 hrs add-on',
  //       days: 'Mon \u2013 Sat',
  //       meals: 'Lunch & Snacks',
  //     },
  //   },
  // ];

  readonly classes: ProgramClass[] = [
    {
      name: 'Playgroup',
      color: '#EB2027',
      eligibility: '2 to 3 years',
      aims: [
        'Build independence and early self-help skills',
        'Foster social skills through guided play',
        'Develop fine and gross motor skills',
      ],
      schedules: [
        {
          label: 'Morning Batch',
          timing: '8:30 AM – 11:30 AM (3 hours)',
          duration: 'April – March',
          days: 'Mon – Fri',
          meals: 'Meal (from home)',
        },
        {
          label: 'Afternoon Batch',
          timing: '11:30 AM – 2:30 PM (3 hours)',
          duration: '3 Hours',
          days: 'Mon – Fri',
          meals: 'Meal (from home)',
        },
      ],
    },

    {
      name: 'Nursery',
      color: '#F69220',
      eligibility: '3 to 4 years',
      aims: [
        'Learning through exploration and academic pre-readiness',
        'Build early phonics and expression',
        'Develop problem-solving through play',
      ],
      schedules: [
        {
          label: 'Morning Batch',
          timing: '8:30 AM – 11:30 AM (3 hours)',
          duration: 'April – March',
          days: 'Mon – Friday',
          meals: 'Meal (from home)',
        },
        {
          label: 'Afternoon Batch',
          timing: '11:30 AM – 2:30 PM (3 hours)',
          duration: '3 Hours',
          days: 'Mon – Fri',
          meals: 'Meal (from home)',
        },
      ],
    },

    {
      name: 'Junior KG',
      color: '#3BB44A',
      eligibility: '4 to 5 years',
      aims: [
        'Strengthen logic and reasoning',
        'Increased focus on academic readiness',
        'Exposure to languages and general knowledge',
      ],
      schedules: [
        {
          label: 'Single Batch',
          timing: '10:30 AM – 2:30 PM (4 hours)',
          duration: 'April – March',
          days: 'Mon – Fri',
          meals: 'Meal (from home)',
        },
      ],
    },

    {
      name: 'Senior KG',
      color: '#006FB9',
      eligibility: '5 to 6 years',
      aims: [
        'Prepare for primary and formal schooling',
        'Advanced academic and reasoning skills',
        'Build confidence and personality development',
      ],
      schedules: [
        {
          label: 'Single Batch',
          timing: '10:30 AM – 2:30 PM (4 hours)',
          duration: 'April – March',
          days: 'Mon – Fri',
          meals: 'Meal (from home)',
        },
      ],
    },
  ];
}
