import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, UserSidebarComponent],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {

  showModal = false;
  selectedScholarship = '';

  student = {
    fullName: 'OLIVEROS, SAMANTHA GAYLE R.',
    course: 'CISCO BSIT',
    yearLevel: '2ND YEAR',
    age: '18 YEARS OLD',
    sex: 'FEMALE',
    scholarshipType: 'ACADEMIC SCHOLARSHIP (FULL SCHOLAR)',
    profileImage: 'assets/images/profile.jpg',
    history: [
      { applicationId: 2135, scholarshipName: 'ACADEMIC SCHOLARSHIP (FULL)', status: 'PENDING',  dateSubmitted: '03-04-2026' },
      { applicationId: 2341, scholarshipName: 'ACADEMIC SCHOLARSHIP (FULL)', status: 'FINISHED', dateSubmitted: '12-02-2025' },
      { applicationId: 6585, scholarshipName: 'ACADEMIC SCHOLARSHIP (FULL)', status: 'FINISHED', dateSubmitted: '10-10-2025' },
      { applicationId: 4563, scholarshipName: 'ACADEMIC SCHOLARSHIP (HALF)', status: 'FINISHED', dateSubmitted: '07-03-2025' },
      { applicationId: 8654, scholarshipName: 'ACADEMIC SCHOLARSHIP (HALF)', status: 'FINISHED', dateSubmitted: '11-06-2024' },
    ]
  };

  constructor() { }
  ngOnInit(): void { }

  openModal(): void {
    this.selectedScholarship = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedScholarship = '';
  }

  submitApplication(): void {
    if (!this.selectedScholarship) return;
    console.log('Applying for:', this.selectedScholarship);
    this.closeModal();
  }
}