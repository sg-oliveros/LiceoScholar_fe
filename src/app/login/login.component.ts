import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { PostsService } from "../../services/posts/posts.service";
import { LoginFormComponent } from "./components/login-form/login-form.component";

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [LoginFormComponent, CommonModule]
})
export class LoginComponent implements OnInit {
    public email = signal<string>('example@email.com');
    public password = signal<string>('password123');

    private postsService = inject(PostsService);

    public posts = signal<any[]>([]);

    async ngOnInit(): Promise<void> {
    const results = await this.postsService.getPosts();
    this.posts.set(results as any);
}

    public handleSubmitClicked() {
    alert("The button is clicked")
    }
}