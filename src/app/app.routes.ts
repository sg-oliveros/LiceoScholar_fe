import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // default route
  { path: 'profile', component: StudentProfileComponent}
  // other routes here if needed
];