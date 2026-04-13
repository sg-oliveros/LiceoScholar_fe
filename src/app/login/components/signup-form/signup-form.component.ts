import { Component, input, model, output } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
  imports: [FormsModule, ReactiveFormsModule]
})
export class SignupFormComponent {
  public disabled = input<boolean>(false);
  public firstName = model<string>('');
  public lastName = model<string>('');
  public course = model<number | string>('');
  public schoolEmail = model<string>('');
  public password = model<string>('');
  public phoneNumber = model<string>('');

  public onsubmit = output<void>();

  public courses = [
    { id: 1, name: 'Bachelor of Arts in Communication' },
    { id: 2, name: 'Bachelor of Arts in International Studies' },
    { id: 3, name: 'Bachelor of Arts in Political Science' },
    { id: 4, name: 'Bachelor of Science in Biology' },
    { id: 5, name: 'Bachelor of Science in Psychology' },
    { id: 6, name: 'Bachelor of Science in Accountancy' },
    { id: 7, name: 'Bachelor of Science in Business Administration' },
    { id: 8, name: 'Bachelor of Science in Management Accounting' },
    { id: 9, name: 'Bachelor of Science in Criminology' },
    { id: 10, name: 'Bachelor of Science in Civil Engineering' },
    { id: 11, name: 'Bachelor of Science in Computer Engineering' },
    { id: 12, name: 'Bachelor of Science in Electronics and Communications Engineering' },
    { id: 13, name: 'Bachelor of Science in Electrical Engineering' },
    { id: 14, name: 'Bachelor of Science in Mechanical Engineering' },
    { id: 15, name: 'Bachelor of Science in Information Technology' },
    { id: 16, name: 'Bachelor of Science in Computer Science' },
    { id: 17, name: 'Bachelor of Science in Medical Laboratory Science' },
    { id: 18, name: 'Bachelor of Music' },
    { id: 19, name: 'Bachelor of Science in Nursing' },
    { id: 20, name: 'Doctor of Dental Medicine' },
    { id: 21, name: 'Bachelor of Science in Pharmacy' },
    { id: 22, name: 'Bachelor of Science in Physical Therapy' },
    { id: 23, name: 'Bachelor of Science in Occupational Therapy' },
    { id: 24, name: 'Bachelor of Science in Radiologic Technology' },
    { id: 25, name: 'Bachelor of Secondary Education' },
    { id: 26, name: 'Bachelor of Elementary Education' }
  ];

  public onsubmitClicked() {
    this.onsubmit.emit();
  }
}