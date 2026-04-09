import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { AdminSelectStudentComponent } from './admin-select-student/admin-select-student.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { StudentListComponent } from './admin-student-list/admin-student-list.component';
import { LoginComponent } from './login/login.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';



export const routes: Routes = [
  { path: '', component: LoginComponent }, // default route
  { path: 'admin-students-list', component: StudentListComponent },
  { path: 'admin-profile', component: AdminProfileComponent }, //admin profile
  { path: 'admin', component: AdminSidebarComponent}, // path for the sidebar
  { path: 'admin/student-profile/:id', component: AdminSelectStudentComponent},
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'user-profile', component: StudentProfileComponent}
];