import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { UsersService, StudentListItem } from '../services/users.service';

@Component({
  selector: 'app-admin-all-students',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './admin-all-students.component.html',
  styleUrls: ['./admin-all-students.component.scss']
})
export class AdminAllStudentsComponent implements OnInit {
  private usersService = inject(UsersService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  students: StudentListItem[] = [];
  searchTerm: string = '';
  isFilterOpen: boolean = false;
  filters = { course: '', activeScholar: '' };
  isLoading = false;
  error: string | null = null;

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.isLoading = true;
    this.usersService.getStudentsList().subscribe({
      next: (students) => {
        console.log('Students loaded:', students);
        this.students = students || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load students:', err);
        this.error = 'Failed to load students: ' + (err.message || 'Unknown error');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filteredStudents(): StudentListItem[] {
    const term = this.searchTerm.toLowerCase();
    return this.students.filter(s => {
      const matchesSearch = s.FullName.toLowerCase().includes(term) ||
        s.Email.toLowerCase().includes(term) ||
        (s.Course && s.Course.toLowerCase().includes(term)) ||
        (s.SchoolID && s.SchoolID.toString().includes(term));
      const matchesCourse = !this.filters.course || s.Course === this.filters.course;
      const matchesActiveScholar = !this.filters.activeScholar || s.IsActiveScholar === this.filters.activeScholar;
      return matchesSearch && matchesCourse && matchesActiveScholar;
    });
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  removeFilter() {
    this.filters = { course: '', activeScholar: '' };
    this.isFilterOpen = false;
  }

  clearSearch() {
    this.searchTerm = '';
  }

  onSelectStudent(student: StudentListItem) {
    this.router.navigate(['/admin/student-profile', student.UserID]);
  }
}
