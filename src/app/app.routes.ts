import { Routes } from '@angular/router';
import { Register } from './userprofile/register/register';
import { Profile } from './userprofile/profile/profile';
import { Guard } from './service/guard';
import { EditProfile } from './userprofile/edit-profile/edit-profile';
import { Rooms } from './room/rooms/rooms';
import { FindBooking } from './find-booking/find-booking';
import { Login } from './common/login/login';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [Guard],
  },
  {
    path: 'edit-profile',
    component: EditProfile,
    canActivate: [Guard],
  },
  {
    path: 'rooms',
    component: Rooms,
  },
  {
    path: 'find-booking',
    component: FindBooking,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
