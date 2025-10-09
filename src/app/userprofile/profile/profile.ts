import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api';
import { Router } from '@angular/router';
import { Booking } from '../../model/booking';
import { User } from '../../model/user';
import { BookingListComponent } from '../../booking/booking-list-component/booking-list-component';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, BookingListComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  user$: Observable<User> = EMPTY;
  bookings$: Observable<Booking[]> = EMPTY;
  error: any = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.user$ = this.apiService.getUserProfile();
    this.bookings$ = this.apiService.getBookings();
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
