import { Component, output } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.scss'],
  imports: [FormsModule]
})
export class ForgetPassComponent {
  public onback = output<void>();
}