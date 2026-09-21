import { Component } from '@angular/core';
import { ProgramBenefits } from './sections/program-benefits/program-benefits';
import { ProgramFacts } from './sections/program-facts/program-facts';
import { ProgramHero } from './sections/program-hero/program-hero';
import { ProgramMoments } from './sections/program-moments/program-moments';
import { ProgramTestimonials } from './sections/program-testimonials/program-testimonials';
import { ProgramWhy } from './sections/program-why/program-why';

@Component({
  selector: 'app-parent-toddler-program',
  imports: [
    ProgramHero,
    ProgramBenefits,
    ProgramFacts,
    ProgramWhy,
    ProgramMoments,
    ProgramTestimonials,
  ],
  templateUrl: './parent-toddler-program.html',
  styleUrl: './parent-toddler-program.scss',
})
export class ParentToddlerProgram {}
