import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgramHero } from './sections/program-hero/program-hero';
import { ProgramFees } from './sections/program-fees/program-fees';
import { ProgramMoments } from './sections/program-moments/program-moments';
import { ProgramTestimonials } from './sections/program-testimonials/program-testimonials';
import { ProgramPillars } from './sections/program-pillars/program-pillars';
import { ProgramStudio } from './sections/program-studio/program-studio';

@Component({
  selector: 'app-after-school-program',
  imports: [
    ProgramHero,
    ProgramFees,
    ProgramMoments,
    ProgramTestimonials,
    ProgramPillars,
    ProgramStudio,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './after-school-program.html',
  styleUrl: './after-school-program.scss',
})
export class AfterSchoolProgram {}
