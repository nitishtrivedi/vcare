import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollReveal } from '../../../../../directives/scroll-reveal';

interface CurriculumCategory {
  title: string;
  items: string[];
  accent: string;
}

@Component({
  selector: 'app-program-curriculum',
  imports: [ScrollReveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-curriculum.html',
  styleUrl: './program-curriculum.scss',
})
export class ProgramCurriculum {
  readonly categories: CurriculumCategory[] = [
    {
      title: 'Literature',
      items: [
        'Jolly Phonics',
        'Speech and Drama',
        'Story Telling',
        'Go Grammar',
        'Explore Encyclopedia',
        'Interview Training',
      ],
      accent: '#EB2027',
    },
    {
      title: 'Arty Crafty',
      items: [
        'Drawing',
        'Fun with Papers',
        'Origami',
        'Fun with Quilling',
        'Writing Improvements',
        'Calligraphy',
      ],
      accent: '#F69220',
    },
    {
      title: 'Fun with Maths',
      items: ['Vedic Maths', 'Abacus', 'Mental Mathematics', 'Speed Maths', 'Math Labs'],
      accent: '#FBED21',
    },
    {
      title: 'Physical Activities',
      items: ['Zumba', 'Dance', 'Yoga', 'Meditation', 'Sports'],
      accent: '#3BB44A',
    },
    {
      title: 'Brain Savvy',
      items: [
        'Right and Left Brain Development',
        'Motor Skills Development',
        'Science Experiments and Programs',
        'Computers',
        'Chess',
      ],
      accent: '#006FB9',
    },
    {
      title: 'Music and Movements',
      items: ['Musical Bounding', 'Imitating Dance', 'Karaoke Rhymes', 'Musical Chair & more'],
      accent: '#874D3E',
    },
    {
      title: 'Moral Values',
      items: ['Pray and Eat', 'Development of Helping Nature', 'Cultural and Religious Activities'],
      accent: '#EB2027',
    },
    {
      title: 'Experimental Learning',
      items: ['Color Mixing Lab', 'Ice Painting', 'Field Visits', 'Gardening and more'],
      accent: '#F69220',
    },
    {
      title: 'History Adventure',
      items: ['Flash Cards', 'Act and Play', 'Historical and Informational Videos'],
      accent: '#3BB44A',
    },
    {
      title: 'Life Skills',
      items: ['Self Grooming', 'Personal Hygiene', 'Pretend Play Scenarios', 'Safety Education'],
      accent: '#006FB9',
    },
  ];
}
