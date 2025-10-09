import { Component } from '@angular/core';
import { ApiService } from '../../service/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from '../../model/room';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-room-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './room-details.html',
  styleUrl: './room-details.css',
})
export class RoomDetails {
  room$: Observable<Room> = EMPTY;
  room: Room | null = null;
  roomId: any = '';
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  totalPrice: number = 0;
  totalDaysToStay: number = 0;
  showDatePicker: boolean = false;
  showBookingPreview: boolean = false;
  message: any = null;
  error: any = null;
  // gets today's date
  minDate: string = new Date().toISOString().split('T')[0];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('RoomDetails - onInit');
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    this.room$ = this.apiService.getRoomById(this.roomId);
    this.room$.subscribe((res) => {
      this.room = res;
    });
  }

  showError(msg: string): void {
    this.error = msg;
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  calculateTotalPrice(): number {
    if (!this.checkInDate || !this.checkOutDate) {
      return 0;
    }

    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      this.showError('Invalid date selected!!');
      return 0;
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.round(
      Math.abs((checkOut.getTime() - checkIn.getTime()) / oneDay)
    );
    this.totalDaysToStay = totalDays;
    return 0;
    // return this.room$ ? this.room$.pricePerNight * totalDays : 0;
  }

  handleConfirmation(): void {
    if (!this.checkInDate || !this.checkOutDate) {
      this.showError('Please select both check-in and check-out dates!!');
      return;
    }

    this.totalPrice = this.calculateTotalPrice();
    this.showBookingPreview = true;
  }

  acceptBooking(): void {
    if (!this.room) return;

    const formarttedCheckInDate = this.checkInDate
      ? new Date(this.checkInDate).toLocaleDateString('en-CA')
      : '';
    const formarttedCheckOutDate = this.checkOutDate
      ? new Date(this.checkOutDate).toLocaleDateString('en-CA')
      : '';

    const booking = {
      checkInDate: formarttedCheckInDate,
      checkOutDate: formarttedCheckOutDate,
      id: this.roomId,
    };

    this.apiService.bookRoom(booking).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.message =
            'Your booking was successful. A payment link will be emailed to you!!';
          setTimeout(() => {
            this.message = null;
            this.router.navigate(['/rooms']);
          }, 8000);
        }
      },
      error: (err) => {
        this.showError(err?.error?.message || 'Unable to make a booking.');
      },
    });
  }

  cancelBookingPreview(): void {
    this.showBookingPreview = false;
  }

  get isLoading(): boolean {
    return !this.room;
  }
}
