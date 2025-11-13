import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { AboutComponent } from './pages/about/about';
import { LoginComponent } from './pages/login/login';

import { LaunchList } from './components/launch-list/launch-list';
import { LaunchDetail } from './components/launch-detail/launch-detail';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'items', component: LaunchList },
  { path: 'items/:id', component: LaunchDetail },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
