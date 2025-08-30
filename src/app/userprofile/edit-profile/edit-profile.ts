import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../service/api';
import { Observable, EMPTY } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfile {
  user$: Observable<any> = EMPTY;
  error: any = null;
  userExists: boolean = false;

  constructor(
    private apiService: Api,
    private router: Router,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user$ = this.apiService.getUserProfile();
  }

  showError(message: string) {
    this.error = message;
    setTimeout(() => {
      this.error = null;
    }, 4000);
  }

  //TODO implement edit profile functionality

  handleDeleteProfile(): void {
    if (!window.confirm('Are you sure you want to delete your account?')) {
      return;
    }

    this.apiService.deleteAccount().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.showError(err?.error?.message || 'Error deleting account');
      },
    });
  }
}
