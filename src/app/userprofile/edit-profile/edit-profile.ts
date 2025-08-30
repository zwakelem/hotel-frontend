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
    this.fetchUserProfile();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  fetchUserProfile(): void {
    this.user$ = this.apiService.user$;
    // this.apiService.getUserProfile().subscribe({
    //   next: (response: any) => {
    //     this.user = response.user;
    //     this.userExists = Object.keys(this.user).length > 0;
    //     console.log(this.user);
    //     console.log(this.userExists);
    //   },
    //   error: (err) => {
    //     this.showError(err?.error?.message || 'Error fetching user profile');
    //   },
    // });
  }

  showError(message: string) {
    this.error = message;
    setTimeout(() => {
      this.error = null;
    }, 4000);
  }

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
