import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
    selector: 'app-user-sidebar',
    standalone: true,
    imports: [CommonModule,RouterLink, RouterLinkActive],
    templateUrl: './user-sidebar.component.html',
    styleUrls: ['./user-sidebar.component.scss']
})
export class UserSidebarComponent {
    public activeItem = signal<'profile'>('profile');

    setActive(item: 'profile') {
    this.activeItem.set(item);
    }
}