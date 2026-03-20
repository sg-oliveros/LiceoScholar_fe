import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';

@Component({
    selector: 'app-student-profile',
    standalone: true,
    imports: [CommonModule, UserSidebarComponent, UserSidebarComponent],
    templateUrl: './student-profile.component.html',
    styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {

    student = {
        fullName: 'OLIVEROS, SAMANTHA GAYLE R.',
        course: 'CISCO BSIT',
        yearLevel: '2ND YEAR',
        age: '18 YEARS OLD',
        sex: 'FEMALE',
        scholarshipType: 'ACADEMIC SCHOLARSHIP (FULL SCHOLAR)',
        profileImage: 'assets/profile.jpg',  // put your image here
        requirements: [
            { name: 'FORM 138', status: 'COMPLETED', date: '04/23/2025' },
            { name: 'COMPLETE GRADES', status: 'COMPLETED', date: '04/23/2025' },
        ]
    };

    constructor() { }

    ngOnInit(): void { }
}