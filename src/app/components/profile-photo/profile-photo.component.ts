import { Component, Input, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../services/upload.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-photo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-photo.component.html',
  styleUrls: ['./profile-photo.component.scss']
})
export class ProfilePhotoComponent {
  private uploadService = inject(UploadService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  @Input() userId: number | null = null;
  @Input() editable: boolean = false;

  photoUrl = signal<string>('assets/images/default-avatar.png');
  isLoading = signal<boolean>(false);
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  ngOnInit() {
    this.loadPhoto();
  }

  loadPhoto() {
    const id = this.userId || this.authService.getCurrentUser()?.UserID;
   
    if (!id) return;

    this.uploadService.getProfilePhoto(id).subscribe({
      next: (response) => {
        this.photoUrl.set(this.uploadService.getPhotoUrl(response.photoUrl));
        
      },
      error: () => {
        this.photoUrl.set('assets/images/default-avatar.png');
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
        this.cdr.detectChanges(); // Force update to show buttons
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadPhoto() {
    if (!this.selectedFile) return;

    const id = this.userId || this.authService.getCurrentUser()?.UserID;
    if (!id) {
      alert('User not found');
      return;
    }

    this.isLoading.set(true);
    this.uploadService.uploadProfilePhoto(id, this.selectedFile).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.photoUrl.set(this.uploadService.getPhotoUrl(response.photoUrl));
        this.previewUrl = null;
        this.selectedFile = null;
        alert('Photo uploaded successfully!');
      },
      error: (err) => {
        this.isLoading.set(false);
        alert(err.error?.message || 'Failed to upload photo');
      }
    });
  }

  cancelUpload() {
    this.selectedFile = null;
    this.previewUrl = null;
    
  }

  deletePhoto() {
    const id = this.userId || this.authService.getCurrentUser()?.UserID;
    if (!id) {
      alert('User not found');
      return;
    }

    if (!confirm('Are you sure you want to delete your profile photo?')) {
      return;
    }

    this.isLoading.set(true);
    this.uploadService.deleteProfilePhoto(id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.photoUrl.set('assets/images/default-avatar.png');
        this.cdr.detectChanges(); 
        alert('Photo deleted successfully!');
      },
      error: (err) => {
        this.isLoading.set(false);
        alert(err.error?.message || 'Failed to delete photo');
      }
    });
  }
}
