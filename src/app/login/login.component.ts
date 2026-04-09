import { CommonModule } from "@angular/common";
import { Component, inject, signal, model } from "@angular/core";
import { Router } from "@angular/router";
import { ForgetPassComponent } from "./components/forget-pass/forget-pass.component";
import { LoginFormComponent } from "./components/login-form/login-form.component";
import { SignupFormComponent } from "./components/signup-form/signup-form.component";
import { SwitchFormComponent } from "./components/switch/switch-form.component";
import { AuthService } from "../services/auth.service";

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

    public email = model<string>('');
    public password = model<string>('');
    public isLoading = signal<boolean>(false);
    public errorMessage = signal<string>('');

    mode = signal<'login' | 'signup' | 'forget'>('login');

    public onModeChange(mode: 'login' | 'signup') {
        this.mode.set(mode);
        this.errorMessage.set('');
    }

    public handleSubmitClicked() {
        if (this.mode() !== 'login') return;

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
            }
        });
    }
}