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
    title: 'Preschool Program | V Care Education',
  },
  {
    path: 'after-school-program',
    loadComponent: () =>
      import('./after-school-program/after-school-program').then((m) => m.AfterSchoolProgram),
    title: 'After School Program | V Care Education',
  },
  {
    path: 'parent-toddler-program',
    loadComponent: () =>
      import('./parent-toddler-program/parent-toddler-program').then((m) => m.ParentToddlerProgram),
    title: 'Parent Toddler Program | V Care Education',
  },
  {
    path: 'daycare-program',
    loadComponent: () => import('./daycare-program/daycare-program').then((m) => m.DaycareProgram),
    title: 'Daycare | V Care Education',
  },
];
