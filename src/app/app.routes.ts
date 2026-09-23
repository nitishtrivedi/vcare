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
    data: {
      seo: {
        title: 'V Care Education | Preschool & Activity Centre in Pune',
        description:
          'V Care Education is a preschool and activity centre in Karvenagar, Pune, offering preschool, daycare, after-school and parent toddler programs.',
        canonical: 'https://vcarepreschool.in/',
        ogImage: 'assets/images/homepage/vcare-hero-image.png',
        robots: 'index,follow',
      },
    },
  },

  {
    path: 'programs',
    loadChildren: () => import('./pages/programs/programs.routes').then((m) => m.PROGRAMS_ROUTES),
  },

  {
    path: 'about-us',
    loadComponent: () => import('./pages/about/about-us/about-us').then((m) => m.AboutUs),
    data: {
      seo: {
        title: 'About V Care Education | Preschool in Karvenagar, Pune',
        description:
          'Learn about V Care Education, a preschool and activity centre in Karvenagar, Pune, built around care, confidence, curiosity and joyful learning.',
        canonical: 'https://vcarepreschool.in/about-us',
        ogImage: 'assets/images/about-us/about-us-hero.JPG',
        robots: 'index,follow',
      },
    },
  },

  {
    path: 'about/zero-fee-model',
    loadComponent: () =>
      import('./pages/about/zero-fee-model/zero-fee-model').then((m) => m.ZeroFeeModel),
    data: {
      seo: {
        title: 'Zero Fee Model | V Care Education, Karvenagar Pune',
        description:
          "Explore V Care's Zero Fee Model, including the four-year Playgroup to Senior KG journey and its education commitments.",
        canonical: 'https://vcarepreschool.in/about/zero-fee-model',
        robots: 'index,follow',
      },
    },
  },

  {
    path: 'about/faq',
    loadComponent: () => import('./pages/about/faq/faq').then((m) => m.Faq),
    data: {
      seo: {
        title: 'V Care FAQ | Programs, Admissions & Daycare in Pune',
        description:
          'Find answers about V Care programs, admissions, the Zero Fee Model, daycare, curriculum, safety and daily life at the centre in Karvenagar, Pune.',
        canonical: 'https://vcarepreschool.in/about/faq',
        robots: 'index,follow',
      },
    },
  },

  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
    data: {
      seo: {
        title: 'Contact V Care Education | Karvenagar, Pune',
        description:
          'Contact V Care Education in Karvenagar, Pune to ask about preschool, daycare, after-school and parent toddler programs or plan a campus visit.',
        canonical: 'https://vcarepreschool.in/contact',
        ogImage: 'assets/images/contact/contact-image.jpg',
        robots: 'index,follow',
      },
    },
  },

  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery').then((m) => m.Gallery),
    data: {
      seo: {
        title: 'V Care Preschool Gallery | Karvenagar, Pune',
        description:
          'Explore photos from V Care Education and see moments from the preschool and activity centre in Karvenagar, Pune.',
        canonical: 'https://vcarepreschool.in/gallery',
        robots: 'index,follow',
      },
    },
  },
  {
    path: 'franchise',
    loadComponent: () => import('./pages/franchise/franchise').then((m) => m.Franchise),
    data: {
      seo: {
        title: 'VCare Preschool Franchise | Education Business Opportunity',
        description:
          'Explore the VCare franchise program, including the Zero Fee Model, curriculum, support systems and launch process for new centres.',
        canonical: 'https://vcarepreschool.in/franchise',
        robots: 'index,follow',
      },
    },
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
    data: {
      seo: {
        title: 'V Care Journal | Parenting & Early Learning',
        description:
          'Read the V Care Journal for stories, ideas and practical insights on children, learning, growth and everyday family life.',
        canonical: 'https://vcarepreschool.in/blog',
        robots: 'index,follow',
      },
    },
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
