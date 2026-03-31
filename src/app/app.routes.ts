import { Routes } from '@angular/router';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // default route
  { path: 'admin-profile', component: AdminProfileComponent } //admin profile
  // other routes here if needed
];