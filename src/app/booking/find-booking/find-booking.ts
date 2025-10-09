import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api';
import { BookingListComponent } from '../booking-list-component/booking-list-component';
import { Booking } from '../../model/booking';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-find-booking',
  imports: [CommonModule, FormsModule, BookingListComponent],
  templateUrl: './find-booking.html',
  styleUrl: './find-booking.css',
})
export class FindBooking {
  constructor(private apiService: ApiService) {}

  confirmationCode: string = '';
  bookingDetails$: Observable<Booking> = EMPTY;
  error: any = null;

  handleSearch() {
    if (!this.confirmationCode.trim()) {
      this.showError('Please enter the booking confirmation code');
      return;
    }

    this.bookingDetails$ = this.apiService.getBookingByReference(
      this.confirmationCode
    );
  }

  showError(err: any): void {
    console.log(err);
    this.error = err;
    setTimeout(() => {
      this.error = '';
    }, 4000);
  }
}
