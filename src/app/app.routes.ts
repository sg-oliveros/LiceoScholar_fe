import { Routes } from '@angular/router';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { StudentListComponent } from './admin-student-list/admin-student-list.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin-profile', component: AdminProfileComponent },
  { path: 'admin-students-list', component: StudentListComponent },
];