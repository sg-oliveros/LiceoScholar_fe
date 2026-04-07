import { Routes } from '@angular/router';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
<<<<<<< HEAD
import { AdminSelectStudentComponent } from './admin-select-student/admin-select-student.component';
=======
>>>>>>> Feature-Dashboard
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { StudentListComponent } from './admin-student-list/admin-student-list.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';



export const routes: Routes = [
  { path: '', component: LoginComponent }, // default route
  { path: 'admin-students-list', component: StudentListComponent },
  { path: 'admin-profile', component: AdminProfileComponent }, //admin profile
  { path: 'admin', component: AdminSidebarComponent}, // path for the sidebar
<<<<<<< HEAD
  { path: 'admin/student-profile/:id', component: AdminSelectStudentComponent}
=======
  { path: 'admin-dashboard', component: AdminDashboardComponent }
>>>>>>> Feature-Dashboard
];