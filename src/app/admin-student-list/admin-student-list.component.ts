import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

export interface Student {
    name: string;
    course: string;
    scholarshipType: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Finished';
}

@Component({
    selector: 'app-admin-student-list',
    standalone: true,
    imports: [CommonModule, FormsModule, AdminSidebarComponent],
    templateUrl: './admin-student-list.component.html',
    styleUrls: ['./admin-student-list.component.scss']
})
export class StudentListComponent implements OnDestroy {
    constructor(private router: Router, private cdr: ChangeDetectorRef) {}

    searchTerm: string = '';
    isFilterOpen: boolean = false;
    openDropdownIndex: number | null = null;

    // Finish term properties
    showFinishDialog: boolean = false;
    countdownTime: number = 5;
    private originalStudentStates: { name: string; status: string }[] = [];

    filters = { course: '', yearLevel: '', scholarship: '', status: '' };

    students: Student[] = [
    { name: 'Oliveros, Samantha Gayle R.', course: 'CISCO BSIT 2-1', scholarshipType: 'Academic Scholarship', status: 'Approved' },
    { name: 'Paradillo, Raque Alexy', course: 'CISCO BSIT 2-1', scholarshipType: 'Non-Academic Scholar..', status: 'Rejected' },
    { name: 'Reyes, Christy Ann E. Reyes', course: 'CISCO BSIT 2-1', scholarshipType: 'Non-Academic Scholar..', status: 'Pending' }
    ];

    filteredStudents() {
    return this.students.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesCourse = !this.filters.course || s.course === this.filters.course;
            const matchesScholarship = !this.filters.scholarship || s.scholarshipType === this.filters.scholarship;
            const matchesStatus = !this.filters.status || s.status === this.filters.status;

            return matchesSearch && matchesCourse && matchesScholarship && matchesStatus;
        });
    }

    onSelectStudent(student: Student) {
        this.router.navigate(['/admin/student-profile', student.name]);
    }

    toggleFilter() { this.isFilterOpen = !this.isFilterOpen; }
    toggleDropdown(i: number) { this.openDropdownIndex = this.openDropdownIndex === i ? null : i; }

    updateStatus(student: Student, newStatus: any) {
    student.status = newStatus;
    this.openDropdownIndex = null;
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
        console.log('Finish term called'); // Debug log
        // Mark all students as finished
        this.students.forEach(student => {
            student.status = 'Finished';
        });
        
        this.showFinishDialog = false;
        this.clearCountdown();
    }

    private startCountdown() {
        console.log('Starting countdown from:', this.countdownTime);
        let counter = 5;
        let startTime = Date.now();
        
        const updateTimer = () => {
            const elapsed = Date.now() - startTime;
            
            if (elapsed >= 1000 && counter > 0) {
                counter--;
                this.countdownTime = counter;
                console.log('Countdown:', this.countdownTime);
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

    ngOnDestroy() {
        this.clearCountdown();
    }
}