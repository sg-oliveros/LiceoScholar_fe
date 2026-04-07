import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { LoginFormComponent } from "./components/login-form/login-form.component";
import { SignupFormComponent } from "./components/signup-form/signup-form.component";
import { SwitchFormComponent } from "./components/switch/switch-form.component";

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [LoginFormComponent, SignupFormComponent, CommonModule, SwitchFormComponent]
})
export class LoginComponent {
    private router = inject(Router);
    public email = signal<string>('example@email.com');
    public password = signal<string>('password123');

    public mode = signal<'login' | 'signup'>('login');


    public onModeChange(mode: 'login' | 'signup') {
    this.mode.set(mode);
    }

    public handleSubmitClicked() {
        alert(`submit clicked in ${this.mode()}`);

        this.router.navigate(['/admin-students-list'])
    }
}