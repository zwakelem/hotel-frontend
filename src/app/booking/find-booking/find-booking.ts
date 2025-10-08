import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../../service/api';
import { BookingListComponent } from '../booking-list-component/booking-list-component';
import { Booking } from '../../model/booking';

@Component({
  selector: 'app-find-booking',
  imports: [CommonModule, FormsModule, BookingListComponent],
  templateUrl: './find-booking.html',
  styleUrl: './find-booking.css',
})
export class FindBooking {
  constructor(private apiService: Api) {}

  confirmationCode: string = '';
  bookingDetails: Booking[] = [];
  error: any = null;

  handleSearch() {
    if (!this.confirmationCode.trim()) {
      this.showError('Please enter the booking confirmation code');
      return;
    }

    this.apiService.getBookingByReference(this.confirmationCode).subscribe({
      next: (res) => {
        console.log(res.booking);
        this.bookingDetails = [res.booking];
      },
      error: (err) => {
        this.showError(err?.error.message || 'Error fetching booking details');
      },
    });
  }

  showError(err: any): void {
    console.log(err);
    this.error = err;
    setTimeout(() => {
      this.error = '';
    }, 4000);
  }
}
