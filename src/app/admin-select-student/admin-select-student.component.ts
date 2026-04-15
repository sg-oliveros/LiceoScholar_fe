import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService, UserProfile } from '../services/users.service';
import { RequirementsService } from '../services/requirements.service';
import { ProfilePhotoComponent } from '../components/profile-photo/profile-photo.component';

@Component({
    selector: 'app-admin-select-student',
    standalone: true,
    imports: [CommonModule, ProfilePhotoComponent],
    templateUrl: './admin-select-student.component.html',
    styleUrls: ['./admin-select-student.component.scss']
})
export class AdminSelectStudentComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private location = inject(Location);
    private UsersService = inject(UsersService);
    private requirementsService = inject(RequirementsService);
    private cdr = inject(ChangeDetectorRef);  
    dropdownPosition = { top: 0, left: 0 };  

    showDeleteModal = false;

    studentName: string | null = '';
    student: UserProfile | null = null;
    userId: number | null = null;
    requirements = signal<any[]>([]);
    openDropdownIndex: number | null = null;
    isLoading = false;
    error: string | null = null;

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.userId = parseInt(idParam, 10);
            this.loadStudentProfile(this.userId);
        }
    }

    loadStudentProfile(userId: number): void {
        this.isLoading = true;
        this.UsersService.getUserProfile(userId).subscribe({
            next: (profile: UserProfile) => {
                this.student = profile;
                this.studentName = profile.FullName;
                console.log(this.student);
                this.loadRequirements(userId);
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to load student profile:', err);
                this.error = 'Failed to load student profile';
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadRequirements(userId: number): void {
        this.requirementsService.getUserRequirements(userId).subscribe({
            next: (response) => {
                this.requirements.set(response);
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to load requirements:', err);
            }
        });
    }

    toggleDropdown(index: number): void {
        this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
    }

    toggleRequirementDropdown(i: number, event?: MouseEvent) { 
        if (this.openDropdownIndex === i) {
            this.openDropdownIndex = null;
        } else {
            this.openDropdownIndex = i;
            if (event) {
                const target = event.target as HTMLElement;
                const rect = target.getBoundingClientRect();
                this.dropdownPosition = {
                    top: rect.bottom + window.scrollY -90,
                    left: rect.left + window.scrollX + (rect.width/2)+110
                };
            }
        }
    }
    deleteModal(): void {
        console.log('Deleting mock data');
        this.showDeleteModal = true;
    }
    closeDeleteModal(): void {
        this.showDeleteModal = false;
    }
    deleteStudent(): void {
        console.log('Deleting student');
        if (!this.userId) return;
        this.UsersService.deleteStudent(this.userId).subscribe({
            next: () => {
                this.showDeleteModal = false;
                this.router.navigate(['/admin-all-students']);
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to delete student:', err);
                alert('Failed to delete student');
            }
        });
    }
    updateRequirementStatus(requirement: any, newStatus: string): void {
        console.log('Requirement object:', requirement);
        const userId = this.userId
        if (!userId) return;
        this.requirementsService.updateRequirementStatus(userId, requirement.requirementID, newStatus).subscribe({
            next: () => {
                requirement.status = newStatus;
                this.openDropdownIndex = null;
                this.cdr.detectChanges();
                this.loadRequirements(userId);
            },
            error: (err) => {
                console.error('Failed to update requirement status:', err);
                alert('Failed to update requirement status');
            }
        });
    }

    goBack(): void {
        this.location.back();
    }
}