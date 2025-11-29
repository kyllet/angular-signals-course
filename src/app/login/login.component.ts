import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessagesService } from '../messages/messages.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import e from 'cors';

@Component({
  selector: 'login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  messageService = inject(MessagesService);
  authenticationService = inject(AuthService);
  router = inject(Router);

  form = this.fb.group({
    email: [''],
    password: [''],
  });

  async onLogin() {
    try {
      const { email, password } = this.form.value;
      if (!email || !password) {
        this.messageService.showMessage('Enter email and password', 'error');
        return;
      }
      await this.authenticationService.login(email, password);
      await this.router.navigate(['/home']);
    } catch (err) {
      console.error(err);
    }
  }
}
