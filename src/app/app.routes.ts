import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { StudentListComponent } from './admin-student-list/admin-student-list.component';  
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';


export const routes: Routes = [
  { path: '', component: LoginComponent }, // default route
  { path: 'admin-students-list', component: StudentListComponent },
  { path: 'admin-profile', component: AdminProfileComponent }, //admin profile
  { path: 'admin', component: AdminSidebarComponent} // path for the sidebar
];