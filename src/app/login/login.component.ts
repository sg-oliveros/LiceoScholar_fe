import { CommonModule } from "@angular/common";
import { Component, inject, signal, model } from "@angular/core";
import { Router } from "@angular/router";
import { ForgetPassComponent } from "./components/forget-pass/forget-pass.component";
import { LoginFormComponent } from "./components/login-form/login-form.component";
import { SignupFormComponent } from "./components/signup-form/signup-form.component";
import { SwitchFormComponent } from "./components/switch/switch-form.component";
import { AuthService } from "../services/auth.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [LoginFormComponent, SignupFormComponent, CommonModule, SwitchFormComponent, ForgetPassComponent]
})
export class LoginComponent {
    private router = inject(Router);
    private authService = inject(AuthService);
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000';

    // Login fields
    public email = model<string>('');
    public password = model<string>('');

    // Signup fields
    public firstName = model<string>('');
    public lastName = model<string>('');
    public course = model<number | string>('');
    public schoolEmail = model<string>('');
    public signupPassword = model<string>('');
    public phoneNumber = model<string>('');
    public schoolID = model<string>('');

    public isLoading = signal<boolean>(false);
    public errorMessage = signal<string>('');

    mode = signal<'login' | 'signup' | 'forget'>('login');

    public onModeChange(mode: 'login' | 'signup' | 'forget') {
        this.mode.set(mode);
        this.errorMessage.set('');
    }

    public handleForget() {
        console.log('handleForget called');
        this.mode.set('forget');
    }

    public handleSubmitClicked() {
        if (this.mode() === 'login') {
            this.handleLogin();
        } else if (this.mode() === 'signup') {
            this.handleSignup();
        }
    }

    private handleLogin() {
        this.isLoading.set(true);
        this.errorMessage.set('');

        const credentials = {
            Email: this.email(),
            Password: this.password()
        };

        this.authService.login(credentials).subscribe({
            next: (response) => {
                this.isLoading.set(false);
                const role = this.authService.getUserRole();
                // Route based on role: 1 = admin, 2 = user
                if (role === 1) {
                    this.router.navigate(['/admin-dashboard']);
                } else {
                    this.router.navigate(['/user-profile']);
                }
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Login failed. Please try again.');
                setTimeout(() => this.errorMessage.set(''), 5000);
            }
        });
    }

    private handleSignup() {
        this.isLoading.set(true);
        this.errorMessage.set('');

        const payload = {
            SchoolID:  this.schoolID(),
            FirstName: this.firstName(),
            LastName: this.lastName(),
            CourseID: this.course(),
            Email: this.schoolEmail(),
            Password: this.signupPassword(),
            Phone_Number: this.phoneNumber(),
            RoleID: 2  // Student role
        };

        this.authService.register(payload).subscribe({
            next: (response) => {
                this.isLoading.set(false);
                alert('Account created successfully! Please login.');
                this.mode.set('login'); 
                // Clear signup form
                this.schoolID.set('');
                this.firstName.set('');
                this.lastName.set('');
                this.course.set('');
                this.schoolEmail.set('');
                this.signupPassword.set('');
                this.phoneNumber.set('');
                
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Registration failed. Please try again.');
                setTimeout(() => this.errorMessage.set(''), 5000);
            }
        });
    }
}