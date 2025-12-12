import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { AboutComponent } from './pages/about/about';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { ProfileComponent } from './pages/profile/profile';
import { OfflinePage } from './pages/offline/offline';

import { authGuard } from './guards/auth.guard';

import { LaunchList } from './components/launch-list/launch-list';
import { LaunchDetail } from './components/launch-detail/launch-detail';
import {FavoritesPage} from './pages/favorites/favorites';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'items', component: LaunchList },
  { path: 'items/:id', component: LaunchDetail },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'favorites', component: FavoritesPage },
  { path: 'offline', component: OfflinePage },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' }
];
