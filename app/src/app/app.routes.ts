import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Home2 } from './home2/home2';

export const routes: Routes = [
  { path: '', redirectTo: '/home2', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'home2', component: Home2 },
  { path: '**', redirectTo: '/home2' },
];
