import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';
import { AuthService } from '../services/auth.service';
import { ApplicationsService } from '../services/applications.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, UserSidebarComponent],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private applicationsService = inject(ApplicationsService);

  showModal = false;
  private currentUserId: number | null = null;
  selectedScholarship = '';
  isLoading = true;

  student = signal({
    fullName: '',
    email: '',
    phone: '',
    course: '',
    profileImage: 'assets/images/profile.jpg'
  });

  applications = signal<any[]>([]);

  constructor() { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.authService.getMe().subscribe({
      next: (response) => {
        
        const user = response.user;
        
        this.currentUserId = user.UserID;
        this.student.set({
          ...this.student(),
          fullName: `${user.LastName}, ${user.FirstName}`,
          email: user.Email,
          phone: user.Phone_number || '',
          course: user.CourseName || user.CourseCode || 'Not assigned'
        });
       
        this.isLoading = false;
        // Load applications after user data is loaded
        this.loadApplications();
      },
      error: (err) => {
        console.error('Failed to load user data:', err);
        this.isLoading = false;
      }
    });
  }

  loadApplications(): void {
    if (!this.currentUserId) return;
    this.applicationsService.getUserApplications(this.currentUserId).subscribe({
      next: (apps) => {
        this.applications.set(apps);
      },
      error: (err) => {
        console.error('Failed to load applications:', err);
      }
    });
  }

  openModal(): void {
    this.selectedScholarship = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedScholarship = '';
  }
  
  
  submitApplication(): void {
    if (!this.selectedScholarship || !this.currentUserId) return;

    // Map scholarship name to ID based on your DB
    const scholarshipMap: { [key: string]: number } = {
      'Academic Scholarship (FULL)': 1,
      'Academic Scholarship (Half)': 2,
      'Non-Academic Scholarship': 3,
      'Special Scholarship': 4
    };

    const scholarshipId = scholarshipMap[this.selectedScholarship];
    if (!scholarshipId) {
      console.error('Unknown scholarship:', this.selectedScholarship);
      return;
    }

    this.applicationsService.createApplication(this.currentUserId, scholarshipId).subscribe({
      next: (response) => {
        console.log('Application submitted:', response);
        alert('Application submitted successfully!');
        this.closeModal();
        this.loadApplications(); // Refresh the list
      },
      error: (err) => {
        console.error('Failed to submit application:', err);
        alert(err.error?.message || 'Failed to submit application');
      }
    });
  }
}