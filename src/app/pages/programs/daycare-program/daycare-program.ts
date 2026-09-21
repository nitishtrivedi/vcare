import { Component } from '@angular/core';
import { ProgramHero } from './sections/program-hero/program-hero';
import { ProgramHighlights } from './sections/program-highlights/program-highlights';
import { ProgramMoments } from './sections/program-moments/program-moments';
import { ProgramSchedule } from './sections/program-schedule/program-schedule';
import { ProgramTestimonials } from './sections/program-testimonials/program-testimonials';
import { ProgramCurriculum } from './sections/program-curriculum/program-curriculum';
import { ProgramNutrition } from './sections/program-nutrition/program-nutrition';
import { ProgramMission } from './sections/program-mission/program-mission';

@Component({
  selector: 'app-daycare-program',
  imports: [
    ProgramHero,
    ProgramHighlights,
    ProgramSchedule,
    ProgramMoments,
    ProgramTestimonials,
    ProgramCurriculum,
    ProgramNutrition,
    ProgramMission,
  ],
  templateUrl: './daycare-program.html',
  styleUrl: './daycare-program.scss',
})
export class DaycareProgram {}
