import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-admin-sidebar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive], //for button navigation
    templateUrl: './admin-sidebar.component.html',
    styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent {} //can be left empty