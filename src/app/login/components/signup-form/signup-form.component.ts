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
  public schoolId = model<string>('');
  public schoolEmail = model<string>('');
  public password = model<string>('');
  public confirmPassword = model<string>('');

  public onsubmit = output<void>();

  public onsubmitClicked() {
    this.onsubmit.emit();
  }
}