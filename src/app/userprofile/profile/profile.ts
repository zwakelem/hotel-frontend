import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Api } from '../../service/api';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user$: Observable<any> = EMPTY;
  bookings: any[] = [];
  error: any = null;

  constructor(private apiService: Api, private router: Router) {}

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  // ngAfterContentChecked() {
  //   this.cdref.detectChanges();
  // }

  showError(message: string) {
    this.error = message;
    setTimeout(() => {
      this.error = null;
    }, 4000);
  }

  fetchUserProfile() {
    this.user$ = this.apiService.user$;
    /*this.apiService.getUserProfile().subscribe({
      next: (response: any) => {
        this.user = response.user;
        console.log('user ' + this.user?.email);
        // fetch this user's bookings
        this.apiService.getBookings().subscribe({
          next: (bookingsResponse: any) => {
            this.bookings = response.bookings;
          },
          error: (err) => {
            this.showError(
              err?.error?.message ||
                err?.error ||
                'Error getting my bookings: ' + err
            );
          },
        });
      },
      error: (err) => {
        this.showError(
          err?.error?.message ||
            err?.error ||
            'Error getting user profile: ' + err
        );
      },
    });*/
  }

  handleLogout() {
    this.apiService.logout();
    this.router.navigate(['/home']);
  }

  handleEditProfile() {
    this.router.navigate(['/edit-profile']);
  }
}
