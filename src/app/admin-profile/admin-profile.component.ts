import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfilePhotoComponent as ProfilePhotoComponent_1 } from "../components/profile-photo/profile-photo.component";
import { ApplicationsService } from '../services/applications.service';
import { AuthService } from '../services/auth.service';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
    selector: 'app-admin-profile',
    standalone: true,
    imports: [CommonModule, AdminSidebarComponent, FormsModule, ProfilePhotoComponent_1],
    templateUrl: './admin-profile.component.html',
    styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {

    private authService = inject(AuthService);
    private applicationsService = inject(ApplicationsService);
  private cd = inject(ChangeDetectorRef);

  private currentUserId: number | null = null;
  showEditInfo = false;

  editFirstName = '';
  editLastName = '';
  editEmail = '';
  editPhone = '';
    
  currentUser: any;

  admin = signal({
    fullName: '',
    email: '',
    phone: '',
    profileImage: 'assets/images/profile.jpg'
  });

  ngOnInit(): void {
    this.loadUserData();
  }
  openEditInfo(): void {
    console.log('openEditInfo clicked');
    // Use raw user data from loadUserData()
    const user = this.currentUser;
    console.log('User data:', this.currentUser);
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
        this.admin.set({
          ...this.admin(),
          fullName: `${user.LastName}, ${user.FirstName}`,
          email: user.Email,
          phone: user.Phone_number || '',
        });
       
        
      },
      error: (err) => {
        console.error('Failed to load user data:', err);
        
      }
    });
  }
}