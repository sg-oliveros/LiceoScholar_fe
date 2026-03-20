import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
    selector: 'app-user-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-sidebar.component.html',
    styleUrls: ['./user-sidebar.component.scss']
})
export class UserSidebarComponent {
    public activeItem = signal<'profile' | 'settings'>('profile');

    setActive(item: 'profile' | 'settings') {
    this.activeItem.set(item);
    }
}