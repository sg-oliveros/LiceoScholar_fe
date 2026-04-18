import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { ApplicationsService } from '../services/applications.service';
import { AuthService } from '../services/auth.service';

export interface Student {
    SchoolID: string;
    applicationId: number;
    userId: number;
    name: string;
    course: string;
    scholarshipType: string;
    submittedDate: string;
    schoolYear: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Finished';
}

@Component({
    selector: 'app-admin-student-list',
    standalone: true,
    imports: [CommonModule, FormsModule, AdminSidebarComponent],
    templateUrl: './admin-student-list.component.html',
    styleUrls: ['./admin-student-list.component.scss']
})
export class StudentListComponent implements OnInit, OnDestroy {
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private applicationsService = inject(ApplicationsService);
    private authService = inject(AuthService);

    isLoading = false;
    error: string | null = null;

    searchTerm: string = '';
    isFilterOpen: boolean = false;
    openDropdownIndex: number | null = null;
    dropdownPosition = { top: 0, left: 0 }; 

    // Finish term properties
    showFinishDialog: boolean = false;
    countdownTime: number = 5;
    private originalStudentStates: { name: string; status: string }[] = [];

    filters = { course: '', yearLevel: '', scholarship: '', status: '' };

    students: Student[] = [];

    ngOnInit() {
        this.loadApplications();
    }

    loadApplications() {
        this.isLoading = true;
        this.applicationsService.getAllApplications().subscribe({
            next: (applications) => {
                // Map backend Application to frontend Student interface
                this.students = applications.map(app => ({
                    SchoolID: String(app.SchoolID),
                    applicationId: app.ApplicationID,
                    userId: app.UserID,
                    name: app.FullName,
                    course: app.Course,
                    scholarshipType: app.ScholarshipType,
                    submittedDate: app.Application_Date,
                    schoolYear: app.SchoolYear,
                    status: app.Status as 'Pending' | 'Approved' | 'Rejected' | 'Finished'
                }));
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to load applications:', err);
                this.error = 'Failed to load applications';
                this.isLoading = false;
            }
        });
    }

    filteredStudents() {
        return this.students.filter(s => {
            const matchesSearch = !this.searchTerm || 
                s.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                (s.SchoolID || '').includes(this.searchTerm) ||
                (s.schoolYear || '').includes(this.searchTerm);
            const matchesCourse = !this.filters.course || s.course === this.filters.course;
            const matchesScholarship = !this.filters.scholarship || s.scholarshipType === this.filters.scholarship;
            const matchesStatus = !this.filters.status || s.status === this.filters.status;
            

            return matchesSearch && matchesCourse && matchesScholarship && matchesStatus;
        });
        
    }

    onSelectStudent(student: Student) {
        this.router.navigate(['/admin/student-profile', student.userId]);
    }

    removeFilter() {
        this.filters = { course: '', yearLevel: '', scholarship: '', status: '' };
        this.isFilterOpen = false;
    }

    toggleFilter() { this.isFilterOpen = !this.isFilterOpen; }
    toggleDropdown(i: number, event?: MouseEvent) { 
        if (this.openDropdownIndex === i) {
            this.openDropdownIndex = null;
        } else {
            this.openDropdownIndex = i;
            if (event) {
                const target = event.target as HTMLElement;
                const rect = target.getBoundingClientRect();
                this.dropdownPosition = {
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX + (rect.width/2)-50
                };
            }
        }
    }

    updateStatus(student: Student, newStatus: 'Pending' | 'Approved' | 'Rejected' | 'Finished') {
        // Update local state first for immediate feedback
        student.status = newStatus;
        this.openDropdownIndex = null;

        if (newStatus === 'Pending') {
            this.applicationsService.changeToPending(student.applicationId).subscribe({
                error: (err) => {
                    console.error('Failed to change to pending:', err);
                    alert('Failed to change application to pending');
                }
            });
            return;
        }
        // Call appropriate API based on status
        if (newStatus === 'Approved') {
            this.applicationsService.acceptApplication(student.applicationId).subscribe({
                error: (err) => {
                    console.error('Failed to approve:', err);
                    alert('Failed to approve application');
                }
            });
        } else if (newStatus === 'Rejected') {
            this.applicationsService.rejectApplication(student.applicationId).subscribe({
                error: (err) => {
                    console.error('Failed to reject:', err);
                    alert('Failed to reject application');
                }
            });
        }
    }

    // Finish term methods
    showFinishTermDialog() {
        console.log('Opening finish term dialog');
        this.showFinishDialog = true;
        this.countdownTime = 5;
        console.log('Initial countdown time set to:', this.countdownTime);
        this.startCountdown();
    }

    cancelFinishTerm() {
        this.showFinishDialog = false;
        this.clearCountdown();
    }

    finishTerm() {
        this.applicationsService.finishTerm().subscribe({
            complete: () => {
                this.updateSySem();
                console.log('Term finished successfully');
                this.showFinishDialog = false;
                this.clearCountdown();
                this.loadApplications();
            },
            error: (err) => {
                console.error('Failed to finish term:', err);
                alert('Failed to finish term');
                
            }
        });
    }

    private startCountdown() {
        console.log('Starting countdown from:', this.countdownTime);
        let counter = 5;
        let startTime = Date.now();
        
        const updateTimer = () => {
            const elapsed = Date.now() - startTime;
            
            if (elapsed >= 1000 && counter > 0) {
                console.log('Countdown tick:', counter);
                counter--;
                this.countdownTime = counter;
                this.cdr.markForCheck();
                this.cdr.detectChanges(); // Force UI update
                startTime = Date.now(); // Reset start time
                
                if (counter <= 0) {
                    console.log('Countdown finished, button should be enabled');
                    return;
                }
            }
            
            if (counter > 0) {
                requestAnimationFrame(updateTimer);
            }
        };
        
        requestAnimationFrame(updateTimer);
    }

    private clearCountdown() {
        // No need to clear with RxJS take operator
    }

    trackByStudentId(index: number, student: Student): number {
        return student.applicationId;
    }

    ngOnDestroy() {
        this.clearCountdown();
    }
    updateSySem(): void {
        this.applicationsService.updateSySem().subscribe({
            complete: () => {
                console.log('SySem updated successfully');
                this.loadApplications();
            },
            error: (err) => {
                console.error('Failed to update SySem:', err);
                alert('Failed to update SySem');
            }
        }); 
    }
}
