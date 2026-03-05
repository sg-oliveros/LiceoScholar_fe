import { Component, output, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-switch-form',
  templateUrl: './switch-form.component.html',
  styleUrls: ['./switch-form.component.scss'],
  imports: [FormsModule, ReactiveFormsModule] 
})
export class SwitchFormComponent {
  // track which tab is active
  public currentMode = signal<'login' | 'signup'>('login');
  public modeChange = output<'login' | 'signup'>();

  public select(mode: 'login' | 'signup') {
    this.currentMode.set(mode);
    this.modeChange.emit(mode);
  }
}