import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-admin-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-sidebar.component.html',
    styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent {
    public activeItem = signal<'profile' | 'settings' | 'students'>('profile');

    setActive(item: 'profile' | 'settings' | 'students') {
        this.activeItem.set(item);
    }
}