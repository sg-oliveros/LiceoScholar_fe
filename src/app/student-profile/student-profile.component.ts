import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfilePhotoComponent as ProfilePhotoComponent_1 } from "../components/profile-photo/profile-photo.component";
import { ApplicationsService } from '../services/applications.service';
import { AuthService } from '../services/auth.service';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, UserSidebarComponent, ProfilePhotoComponent_1],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private applicationsService = inject(ApplicationsService);
  private cd = inject(ChangeDetectorRef);

  showEditInfo = false;
  showApplyModal = false;
  private currentUserId: number | null = null;
  selectedScholarship = '';
  isLoading = true;

  
  editFirstName = '';
  editLastName = '';
  editEmail = '';
  editPhone = '';

  currentUser: any;

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
  

  openEditInfo(): void {
    console.log('openEditInfo clicked');
    // Use raw user data from loadUserData()
    const user = this.currentUser;
    if (!user) {
      alert('User data not loaded yet');
      return;
    }
    
    this.editLastName = user.LastName || '';
    this.editFirstName = user.FirstName || '';
    this.editEmail = user.Email || '';
    this.editPhone = user.Phone_number || '';
    this.showEditInfo = true;
    console.log('Edit modal opened with user data');
  }

  closeEditInfo(): void {
    this.showEditInfo = false;
  }

  saveInfo(): void {
    if (!this.currentUserId) return;

    const updateData = {
      FirstName: this.editFirstName,
      LastName: this.editLastName,
      Email: this.editEmail,
      Phone_number: this.editPhone
    };

    // You'll need to add updateUser to auth.service.ts
    this.authService.updateUser(this.currentUserId, updateData).subscribe({
      next: () => {
        alert('Profile saved successfully!');
        this.closeEditInfo();
        this.loadUserData();
      },
      error: (err: any) => {
        console.error('Failed to save profile:', err);
        alert('Failed to save profile');
      }
    });
  }

  loadUserData(): void {
    this.authService.getMe().subscribe({
      next: (response) => {
        
        const user = response.user;
        this.currentUser = user;
        
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
      next: (response) => {
        this.applications.set(response);
      },
      error: (err) => {
        console.error('Failed to load applications:', err);
      }
    });
  }

  openApplyModal(): void {
    this.selectedScholarship = '';
    this.showApplyModal = true;
  }

  closeApplyModal(): void {
    this.showApplyModal = false;
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
        this.closeApplyModal();
        this.loadApplications(); // Refresh the list
      },
      error: (err) => {
        console.error('Failed to submit application:', err);
        alert(err.error?.message || 'Failed to submit application');
      }
    });
  }
}