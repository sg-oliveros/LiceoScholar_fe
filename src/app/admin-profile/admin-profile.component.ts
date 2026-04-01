import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
    selector: 'app-admin-profile',
    standalone: true,
    imports: [CommonModule, AdminSidebarComponent, FormsModule, RouterLink, RouterLinkActive],
    templateUrl: './admin-profile.component.html',
    styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {

    isEditing: boolean = false;

    admin = {
    fullName: 'Alvarez, James Jason, R. PHD.',
    age: '26 years old',
    sex: 'Male',
    email: 'jamesja45620@liceo.edu.ph',
    phone: '+63 9523004572',
    profileImage: 'assets/profile.jpg'
    };

    constructor() {}

    ngOnInit(): void {}

    toggleEdit() {
    this.isEditing = !this.isEditing;
    }

    saveChanges() {
    this.isEditing = false;


    }
}