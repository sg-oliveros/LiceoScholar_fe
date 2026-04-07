import { CommonModule } from "@angular/common";
import { Component, output } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-forget-pass',
  standalone: true,
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class ForgetPassComponent {
  public onback = output<void>();
  
  step: number = 1;

  nextStep() {
    this.step = 2;
  }

  finishReset() {
    alert("Success!");
    this.onback.emit();
  }
}