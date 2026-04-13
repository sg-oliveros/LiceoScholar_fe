import { CommonModule } from "@angular/common";
import { Component, ChangeDetectorRef, inject, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-forget-pass',
  standalone: true,
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class ForgetPassComponent {
  
  public onback = output<void>();
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  step: number = 1;
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordError: string = '';
  emailError: string = '';
  otpError: string = '';
  isLoading: boolean = false;

  passwordsMatch(): boolean {
    return this.newPassword.length > 0 && this.newPassword === this.confirmPassword;
  }

  nextStep() {
    console.log('nextStep called, email:', this.email);
    if (!this.email || this.email.trim() === '') {
      this.emailError = 'Please enter your email address';
      console.log('Email empty, showing error');
      return;
    }

    this.isLoading = true;
    this.emailError = '';
    console.log('Calling forgetPassword API...');

    this.authService.forgetPassword(this.email).subscribe({
      next: (_response: unknown) => {
        console.log('API success, going to step 2');
        this.isLoading = false;
        this.step = 2;
        this.cdr.detectChanges();
      },
      error: (err: { error?: { message?: string } }) => {
        console.log('API error:', err);
        this.isLoading = false;
        this.emailError = err.error?.message || 'Failed to send code. Please try again.';
      }
    });
  }

  finishReset() {
    if (!this.passwordsMatch()) {
      this.passwordError = 'Passwords do not match';
      return;
    }
    this.authService.resetPassword(this.otp.trim(), this.newPassword).subscribe({
      next: (_response: unknown) => {
        alert("Success!");
        this.onback.emit();
      },
      error: (err: { error?: { message?: string } }) => {
        this.otpError = err.error?.message || 'Failed to reset password. Please try again.';
      }
    });
  }
}