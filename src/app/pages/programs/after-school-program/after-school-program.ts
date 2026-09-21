import { Component } from '@angular/core';
import { ProgramAims } from './sections/program-aims/program-aims';
import { ProgramFacts } from './sections/program-facts/program-facts';
import { ProgramFees } from './sections/program-fees/program-fees';
import { ProgramHero } from './sections/program-hero/program-hero';
import { ProgramHighlights } from './sections/program-highlights/program-highlights';
import { ProgramMoments } from './sections/program-moments/program-moments';
import { ProgramTestimonials } from './sections/program-testimonials/program-testimonials';

@Component({
  selector: 'app-after-school-program',
  imports: [
    ProgramHero,
    ProgramAims,
    ProgramFacts,
    ProgramHighlights,
    ProgramFees,
    ProgramMoments,
    ProgramTestimonials,
  ],
  templateUrl: './after-school-program.html',
  styleUrl: './after-school-program.scss',
})
export class AfterSchoolProgram {}
