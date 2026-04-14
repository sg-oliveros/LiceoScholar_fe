import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private location = inject(Location);
    private UsersService = inject(UsersService);
    private requirementsService = inject(RequirementsService);
    private cdr = inject(ChangeDetectorRef);    

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

    updateRequirementStatus(requirement: any, newStatus: string): void {
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