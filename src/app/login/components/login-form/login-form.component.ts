import { Component, input, model, output } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [FormsModule, ReactiveFormsModule] 
})
export class LoginFormComponent {
  public disabled = input<boolean>(false);
  
  public email = model.required<string>();
  public password = model.required<string>();

  public onsubmit = output<void>();
  public onforget = output<void>();

  public onsubmitClicked() {
    this.onsubmit.emit();
  }
}