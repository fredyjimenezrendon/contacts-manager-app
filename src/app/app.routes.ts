import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/contact-list/contact-list').then((m) => m.ContactList),
  },
  {
    path: 'contacts/new',
    loadComponent: () =>
      import('./components/contact-form/contact-form').then((m) => m.ContactForm),
  },
  {
    path: 'contacts/:id',
    loadComponent: () =>
      import('./components/contact-detail/contact-detail').then((m) => m.ContactDetail),
  },
  {
    path: 'contacts/:id/edit',
    loadComponent: () =>
      import('./components/contact-form/contact-form').then((m) => m.ContactForm),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
