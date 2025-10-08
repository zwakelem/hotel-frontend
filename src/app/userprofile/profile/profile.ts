import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Api } from '../../service/api';
import { Router } from '@angular/router';
import { Observable, EMPTY, combineLatest, tap, map } from 'rxjs';
import { Booking } from '../../model/booking';
import { User } from '../../model/user';
import { BookingListComponent } from '../../booking/booking-list-component/booking-list-component';

interface ProfileData {
  user: User;
  bookings: Booking[];
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, BookingListComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  profileData$: Observable<ProfileData> = EMPTY;
  error: any = null;

  constructor(private apiService: Api, private router: Router) {}

  ngOnInit(): void {
    const user$: Observable<User> = this.apiService.getUserProfile();
    const bookings$: Observable<Booking[]> = this.apiService.getBookings();
    this.profileData$ = combineLatest([user$, bookings$]).pipe(
      map(([user, bookings]) => {
        return {
          user,
          bookings,
        };
      }),
      tap(console.log)
    );
  }

  showError(message: string) {
    this.error = message;
    setTimeout(() => {
      this.error = null;
    }, 4000);
  }

  handleLogout() {
    this.apiService.logout();
    this.router.navigate(['/home']);
  }

  handleEditProfile() {
    this.router.navigate(['/edit-profile']);
  }
}
