// import { Routes } from '@angular/router';

// const PRESCHOOL_PROGRAM = () =>
//   import('./preschool-program/preschool-program').then((m) => m.PreschoolProgram);

// export const PROGRAMS_ROUTES: Routes = [
//   { path: 'playgroup', loadComponent: PRESCHOOL_PROGRAM, title: 'Playgroup | V Care Education' },
//   { path: 'nursery', loadComponent: PRESCHOOL_PROGRAM, title: 'Nursery | V Care Education' },
//   { path: 'junior-kg', loadComponent: PRESCHOOL_PROGRAM, title: 'Junior KG | V Care Education' },
//   { path: 'senior-kg', loadComponent: PRESCHOOL_PROGRAM, title: 'Senior KG | V Care Education' },

//   // TODO: no dedicated content yet for these two — temporarily pointed at
//   // PreschoolProgram so the nav links work. Replace with real pages later.
//   {
//     path: 'mother-toddler',
//     loadComponent: PRESCHOOL_PROGRAM,
//     title: 'Mother Toddler | V Care Education',
//   },
//   {
//     path: 'after-school',
//     loadComponent: PRESCHOOL_PROGRAM,
//     title: 'After School | V Care Education',
//   },

//   // Original path kept in case anything links to it directly.
//   {
//     path: 'preschool-program',
//     loadComponent: PRESCHOOL_PROGRAM,
//     title: 'Preschool Program | V Care Education',
//   },

//   { path: '', redirectTo: 'playgroup', pathMatch: 'full' },
// ];
import { Routes } from '@angular/router';

export const PROGRAMS_ROUTES: Routes = [
  {
    path: 'preschool-program',
    loadComponent: () =>
      import('./preschool-program/preschool-program').then((m) => m.PreschoolProgram),
    data: {
      seo: {
        title: 'Preschool Program | V Care Education, Karvenagar Pune',
        description:
          "V Care's Preschool Program in Karvenagar, Pune supports children aged 2–6 through joyful, stimulating learning across four developmental stages.",
        canonical: 'https://vcarepreschool.in/programs/preschool-program',
        ogImage: 'assets/images/pages/preschool/preschool-hero.png',
        robots: 'index,follow',
      },
    },
  },
  {
    path: 'after-school-program',
    loadComponent: () =>
      import('./after-school-program/after-school-program').then((m) => m.AfterSchoolProgram),
    data: {
      seo: {
        title: 'After School Program | V Care Education, Pune',
        description:
          'V Care After School Program provides a safe, supervised extension of the school day with homework support, creative play and active movement.',
        canonical: 'https://vcarepreschool.in/programs/after-school-program',
        ogImage: 'assets/images/programs/after-school.png',
        robots: 'index,follow',
      },
    },
  },
  {
    path: 'parent-toddler-program',
    loadComponent: () =>
      import('./parent-toddler-program/parent-toddler-program').then((m) => m.ParentToddlerProgram),
    data: {
      seo: {
        title: 'Parent Toddler Program | V Care Education, Pune',
        description:
          "V Care's Parent Toddler Program introduces children aged 6 months–2 years to a social, preschool-like environment alongside a parent or caregiver.",
        canonical: 'https://vcarepreschool.in/programs/parent-toddler-program',
        ogImage: 'assets/images/pages/parent-toddler/mother-toddler-hero.jpg',
        robots: 'index,follow',
      },
    },
  },
  {
    path: 'daycare-program',
    loadComponent: () => import('./daycare-program/daycare-program').then((m) => m.DaycareProgram),
    data: {
      seo: {
        title: 'Daycare Program | V Care Education, Karvenagar Pune',
        description:
          'V Care Daycare in Karvenagar, Pune provides a safe, homely environment for children from 6 months to 8 years, with learning, play and daily care.',
        canonical: 'https://vcarepreschool.in/programs/daycare-program',
        robots: 'index,follow',
      },
    },
  },
];
