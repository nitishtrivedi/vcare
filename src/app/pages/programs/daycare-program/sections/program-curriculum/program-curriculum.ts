import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GsapReveal } from '../../../../../directives/gsap-reveal';

interface Track {
  no: string;
  title: string;
  items: string[];
  tone: 'blue' | 'green' | 'orange';
}

interface NutritionGroup {
  title: string;
  points: string[];
}

@Component({
  selector: 'app-program-curriculum',
  imports: [GsapReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-curriculum.html',
  styleUrl: './program-curriculum.scss',
})
export class ProgramCurriculum {
  readonly tracks: Track[] = [
    {
      no: '01',
      title: 'Literature',
      items: [
        'Jolly Phonics',
        'Speech and drama',
        'Storytelling',
        'Go Grammar',
        'Explore encyclopedia',
        'Interview training',
      ],
      tone: 'blue',
    },
    {
      no: '02',
      title: 'Arty crafty',
      items: [
        'Drawing',
        'Paper craft',
        'Origami',
        'Quilling',
        'Writing improvement',
        'Calligraphy',
      ],
      tone: 'orange',
    },
    {
      no: '03',
      title: 'Fun with maths',
      items: ['Vedic maths', 'Abacus', 'Mental mathematics', 'Speed maths', 'Math labs'],
      tone: 'green',
    },
    {
      no: '04',
      title: 'Physical activities',
      items: ['Zumba', 'Dance', 'Yoga', 'Meditation', 'Sports'],
      tone: 'blue',
    },
    {
      no: '05',
      title: 'Brain savvy',
      items: [
        'Left and right brain development',
        'Motor skills',
        'Science experiments',
        'Computers',
        'Chess',
      ],
      tone: 'green',
    },
    {
      no: '06',
      title: 'Music & movement',
      items: ['Musical bounding', 'Imitating dance', 'Karaoke rhymes', 'Musical chairs & more'],
      tone: 'orange',
    },
    {
      no: '07',
      title: 'Moral values',
      items: ['Pray and eat', 'Helping nature', 'Cultural and religious activities'],
      tone: 'blue',
    },
    {
      no: '08',
      title: 'Experimental learning',
      items: ['Colour mixing lab', 'Ice painting', 'Field visits', 'Gardening & more'],
      tone: 'green',
    },
    {
      no: '09',
      title: 'History adventure',
      items: ['Flash cards', 'Act and play', 'Historical and informational videos'],
      tone: 'orange',
    },
    {
      no: '10',
      title: 'Life skills',
      items: ['Self grooming', 'Personal hygiene', 'Pretend play scenarios', 'Safety education'],
      tone: 'blue',
    },
  ];

  readonly nutrition = {
    why: [
      'Fuels active play and learning',
      'Supports brain development and focus',
      'Builds immunity and healthy growth',
      'Encourages independence in eating and trying new foods',
    ] as string[],
    partner: [
      'Share dietary needs and allergies with us',
      'Reinforce healthy eating habits at home',
      'Pack simple, wholesome foods if sending meals from home',
    ] as string[],
  };

  readonly groups: NutritionGroup[] = [
    { title: 'Why nutrition matters', points: this.nutrition.why },
    { title: 'Parent partnership', points: this.nutrition.partner },
  ];
}
