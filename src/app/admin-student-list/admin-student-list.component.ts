import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    styleUrl: './admin-student-list.component.scss'
})
export class StudentListComponent {
    searchTerm: string = '';
    isFilterOpen: boolean = false;
    openDropdownIndex: number | null = null;


    filters = { course: '', yearLevel: '', scholarship: '', status: '' };

    students: Student[] = [
    { name: 'Oliveros, Samantha Gayle R.', course: 'CISCO BSIT 2-1', scholarshipType: 'Academic Scholarship', status: 'Approved' },
    { name: 'Paradillo, Raque Alexy', course: 'CISCO BSIT 2-1', scholarshipType: 'Non-Academic Scholar..', status: 'Rejected' },
    { name: 'Reyes, Christy Ann E. Reyes', course: 'CISCO BSIT 2-1', scholarshipType: 'Non-Academic Scholar..', status: 'Pending' }
    ];

    filteredStudents() {
    return this.students.filter(s => s.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    toggleFilter() { this.isFilterOpen = !this.isFilterOpen; }
    toggleDropdown(i: number) { this.openDropdownIndex = this.openDropdownIndex === i ? null : i; }

    updateStatus(student: Student, newStatus: any) {
    student.status = newStatus;
    this.openDropdownIndex = null;
    }
}