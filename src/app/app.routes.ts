import { Routes } from '@angular/router';
import { Home } from '@components/home/home';
import { LocationDetails } from '@components/location-details/location-details';
import { PageNotFound } from './page-not-found/page-not-found';
import { LinkedSignal } from '@components/linked-signal/linked-signal';
import { Forms } from '@components/forms/forms';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home page',
  },
  {
    path: 'details/:id',
    // component: LocationDetails,
    loadComponent: () =>
      import('./components/location-details/location-details').then((m) => m.LocationDetails),
    title: 'Home details',
  },
  {
    path: 'linked-signal',
    component: LinkedSignal,
  },
  {
    path: 'form',
    component: Forms,

    title: 'Forms ',
  },
  {
    path: '404',
    component: PageNotFound,
    title: 'Page Not Found',
  },
];
