import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgramClasses } from './sections/program-classes/program-classes';
import { ProgramHero } from './sections/program-hero/program-hero';
import { ProgramLearnings } from './sections/program-learnings/program-learnings';
import { ProgramMoments } from './sections/program-moments/program-moments';

@Component({
  selector: 'app-preschool-program',
  imports: [ProgramHero, ProgramLearnings, ProgramClasses, ProgramMoments],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './preschool-program.html',
  styleUrl: './preschool-program.scss',
})
export class PreschoolProgram {}
