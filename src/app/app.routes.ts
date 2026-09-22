// import { Routes } from '@angular/router';

// export const routes: Routes = [
//   {
//     path: '',
//     loadComponent: () => import('./pages/home/home').then((m) => m.Home),
//   },
//   {
//     path: 'programs',
//     loadChildren: () => import('./pages/programs/programs.routes').then((m) => m.PROGRAMS_ROUTES),
//   },
//   {
//     path: 'about-us',
//     loadComponent: () => import('./pages/about/about-us/about-us').then((m) => m.AboutUs),
//     title: 'About V Care | V Care Education',
//   },
//   {
//     path: 'about/zero-fee-model',
//     loadComponent: () =>
//       import('./pages/about/zero-fee-model/zero-fee-model').then((m) => m.ZeroFeeModel),
//     title: 'Zero Fee Model | V Care Education',
//   },
//   {
//     path: 'about/faq',
//     loadComponent: () => import('./pages/about/faq/faq').then((m) => m.Faq),
//     title: 'FAQ | V Care Education',
//   },
//   {
//     path: 'contact',
//     loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
//     title: 'Contact Us | V Care Education',
//   },
//   {
//     path: 'gallery',
//     loadComponent: () => import('./pages/gallery/gallery').then((m) => m.Gallery),
//     title: 'Gallery | V Care Education',
//   },

//   { path: '**', redirectTo: '' },
// ];
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  /*
   * ==========================================================
   * PUBLIC WEBSITE
   * ==========================================================
   */

  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },

  {
    path: 'programs',
    loadChildren: () => import('./pages/programs/programs.routes').then((m) => m.PROGRAMS_ROUTES),
  },

  {
    path: 'about-us',
    loadComponent: () => import('./pages/about/about-us/about-us').then((m) => m.AboutUs),
    title: 'About V Care | V Care Education',
  },

  {
    path: 'about/zero-fee-model',
    loadComponent: () =>
      import('./pages/about/zero-fee-model/zero-fee-model').then((m) => m.ZeroFeeModel),
    title: 'Zero Fee Model | V Care Education',
  },

  {
    path: 'about/faq',
    loadComponent: () => import('./pages/about/faq/faq').then((m) => m.Faq),
    title: 'FAQ | V Care Education',
  },

  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
    title: 'Contact Us | V Care Education',
  },

  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery').then((m) => m.Gallery),
    title: 'Gallery | V Care Education',
  },
  {
    path: 'franchise',
    loadComponent: () => import('./pages/franchise/franchise').then((m) => m.Franchise),
    title: 'Franchise | V Care Education',
  },

  /*
   * ==========================================================
   * PUBLIC BLOG
   * ==========================================================
   *
   * Blog is part of the public website.
   *
   * It is NOT the admin application.
   */

  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog').then((m) => m.Blog),
    title: 'Blog | V Care Education',
  },

  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/blog/article/article').then((m) => m.Article),
  },

  /*
   * ==========================================================
   * ADMIN APPLICATION
   * ==========================================================
   */

  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/login/login').then((m) => m.Login),
    title: 'Admin Login | V Care Education',
  },

  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Admin Dashboard | V Care Education',
  },

  /*
   * ADMIN BLOG MANAGEMENT
   */

  {
    path: 'admin/blogs',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/admin/blogs/blog-list/blog-list').then((m) => m.BlogList),
    title: 'Manage Blogs | V Care Education',
  },

  {
    path: 'admin/blogs/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin/blogs/blog-editor/blog-editor').then((m) => m.BlogEditor),
    title: 'New Blog | V Care Education',
  },

  {
    path: 'admin/blogs/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin/blogs/blog-editor/blog-editor').then((m) => m.BlogEditor),
    title: 'Edit Blog | V Care Education',
  },

  /*
   * Future Admin modules deliberately remain separate.
   *
   * /admin/services
   * /admin/gallery
   * /admin/enquiries
   * /admin/users
   *
   * will be added as independent modules later.
   */

  {
    path: '**',
    redirectTo: '',
  },
];
