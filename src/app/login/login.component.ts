import { CommonModule } from "@angular/common";
<<<<<<< HEAD
import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
=======
import { Component, signal } from "@angular/core";
import { Router } from "@angular/router"; // 1. Import the Router
>>>>>>> Feature-Dashboard
import { LoginFormComponent } from "./components/login-form/login-form.component";
import { SignupFormComponent } from "./components/signup-form/signup-form.component";
import { SwitchFormComponent } from "./components/switch/switch-form.component";

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    // 2. Make sure CommonModule is here (it already is)
    imports: [LoginFormComponent, SignupFormComponent, CommonModule, SwitchFormComponent]
})
export class LoginComponent {
    private router = inject(Router);
    public email = signal<string>('example@email.com');
    public password = signal<string>('password123');

    public mode = signal<'login' | 'signup'>('login');

    // 3. Inject the router in the constructor
    constructor(private router: Router) {}

    public onModeChange(mode: 'login' | 'signup') {
    this.mode.set(mode);
    }

    public handleSubmitClicked() {
<<<<<<< HEAD
        alert(`submit clicked in ${this.mode()}`);

        this.router.navigate(['/admin-students-list'])
=======
        // 4. Navigate to the dashboard route we created in app.routes.ts
        if (this.mode() === 'login') {
            this.router.navigate(['/admin-dashboard']);
        } else {
            alert("Signup successful! Please log in.");
            this.mode.set('login');
        }
>>>>>>> Feature-Dashboard
    }
}