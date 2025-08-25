import { Component } from '@angular/core';
import { Api } from '../service/api';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  formData: any = {
    email: '',
    password: '',
  };
  error: any = null;

  constructor(private apiService: Api, private router: Router) {}

  async handleSubmit() {
    if (!this.formData.email || !this.formData.password) {
      this.showError('All fields required!!');
      return;
    }
    this.apiService.loginUser(this.formData).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.apiService.encryptAndSaveToStorage('token', res.token);
          this.apiService.encryptAndSaveToStorage('role', res.role);
          this.router.navigate(['/']);
        }
      },
      error: (err: any) => {
        this.showError(
          err?.error?.message || err.message || 'Unable to login user: ' + err
        );
      },
    });
  }

  showError(message: string) {
    this.error = message;
    setTimeout(() => {
      this.error = null;
    }, 4000);
  }
}
