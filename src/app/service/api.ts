import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../model/user';
import { MessagesService } from './messages.service';
import { LoadingService } from './loading.service';
import { Response } from '../model/response';
import { Booking } from '../model/booking';
import { Constants } from '../util/Constants';
import { Room } from '../model/room';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private subject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.subject.asObservable();

  private roomTypeSubject = new BehaviorSubject<string[]>([]);
  courses$: Observable<string[]> = this.roomTypeSubject.asObservable();

  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private messagesService: MessagesService
  ) {
    this.loadRoomTypes();
  }

  //
  encryptAndSaveToStorage(key: string, value: string): void {
    const encryptedValue = CryptoJS.AES.encrypt(
      value,
      Constants.ENCRYPTION_KEY
    ).toString();
    localStorage.setItem(key, encryptedValue);
  }

  private getFromStorageAndDecrypt(key: string): string | null {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      return CryptoJS.AES.decrypt(
        encryptedValue,
        Constants.ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return null;
    }
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  private getHeader(): HttpHeaders {
    const token = this.getFromStorageAndDecrypt('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /*****************************
   * USER API
   *****************************/

  registerUser(body: any): Observable<any> {
    return this.http.post(`${Constants.BASE_URL}/auth/register`, body);
  }

  loginUser(body: any): Observable<any> {
    return this.http.post(`${Constants.BASE_URL}/auth/login`, body);
  }

  getUserProfile(): Observable<User> {
    return this.http
      .get<Response>(`${Constants.BASE_URL}/users/account`, {
        headers: this.getHeader(),
      })
      .pipe(
        map((response) => response['user']),
        shareReplay()
      );
  }

  //TODO implement Partial
  updateProfile(user: User): Observable<any> {
    return this.http.put(`${Constants.BASE_URL}/users/update`, user, {
      headers: this.getHeader(),
    });
  }

  getBookings(): Observable<Booking[]> {
    return this.http
      .get<Response>(`${Constants.BASE_URL}/users/bookings`, {
        headers: this.getHeader(),
      })
      .pipe(
        map((response) => response['bookings']),
        shareReplay()
      );
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${Constants.BASE_URL}/users/delete`, {
      headers: this.getHeader(),
    });
  }

  /*****************************
   * ROOMS API
   *****************************/

  deleteRoom(roomId: string): Observable<any> {
    return this.http.delete(`${Constants.BASE_URL}/rooms/delete/${roomId}`, {
      headers: this.getHeader(),
    });
  }

  getRoomById(roomId: string): Observable<Room> {
    return this.http
      .get<Response>(`${Constants.BASE_URL}/rooms/${roomId}`)
      .pipe(map((res) => res['room']));
  }

  getAllRooms(): Observable<Room[]> {
    return this.http
      .get<Response>(`${Constants.BASE_URL}/rooms/all`)
      .pipe(map((res) => res['rooms']));
  }

  loadRoomTypes() {
    const loadRoomTypes$ = this.http
      .get<string[]>(`${Constants.BASE_URL}/rooms/types`)
      .pipe(
        map((res) => res),
        catchError((err) => {
          const message = 'Could not load room types';
          this.messagesService.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        tap((types) => this.roomTypeSubject.next(types))
      );
    this.loading.showLoaderUntilCompleted(loadRoomTypes$).subscribe();
  }

  getRoomTypes(): Observable<any> {
    return this.http.get<Response>(`${Constants.BASE_URL}/rooms/types`);
  }

  getAvailableRooms(
    checkInDate: string,
    checkOutDate: string,
    roomType: string
  ): Observable<Room[]> {
    return this.http
      .get<Response>(`${Constants.BASE_URL}/rooms/available`, {
        params: { checkInDate, checkOutDate, roomType },
      })
      .pipe(map((res) => res['rooms']));
  }

  updateRoom(formData: any): Observable<any> {
    return this.http.put(`${Constants.BASE_URL}/rooms/`, formData, {
      headers: this.getHeader(),
    });
  }

  addRoom(formData: any): Observable<any> {
    return this.http.post(`${Constants.BASE_URL}/rooms/add`, formData, {
      headers: this.getHeader(),
    });
  }

  getRoomsByType(roomType: string): Observable<Room[]> {
    return this.http
      .get<Response>(`${Constants.BASE_URL}/rooms/roombytype`, {
        params: { roomType },
      })
      .pipe(map((res) => res['rooms']));
  }

  /*****************************
   * BOOKINGS API
   *****************************/

  bookRoom(booking: any): Observable<any> {
    return this.http.post(`${Constants.BASE_URL}/bookings`, booking, {
      headers: this.getHeader(),
    });
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http
      .get<Response>(`${Constants.BASE_URL}/bookings/all`, {
        headers: this.getHeader(),
      })
      .pipe(map((res) => res['bookings']));
  }

  updateBooking(booking: any): Observable<any> {
    return this.http.put(`${Constants.BASE_URL}/bookings/update`, booking, {
      headers: this.getHeader(),
    });
  }

  getBookingByReference(bookingCode: string): Observable<Booking> {
    return this.http
      .get<Response>(`${Constants.BASE_URL}/bookings/${bookingCode}`)
      .pipe(map((res) => res['booking']));
  }

  /*****************************
   * PAYMENT API
   *****************************/

  proceedForPayment(body: any): Observable<any> {
    return this.http.post(`${Constants.BASE_URL}/payments/pay`, body, {
      headers: this.getHeader(),
    });
  }

  updateBookingPayment(body: any): Observable<any> {
    return this.http.put(`${Constants.BASE_URL}/payments/update`, body, {
      headers: this.getHeader(),
    });
  }

  /*****************************
   * AUTH CHECKER
   *****************************/

  logout(): void {
    this.clearAuth();
  }

  isAuthenticated(): boolean {
    const token = this.getFromStorageAndDecrypt('token');
    return !!token;
  }

  isAdmin(): boolean {
    const role = this.getFromStorageAndDecrypt('role');
    return role === 'ADMIN';
  }

  isCustomer(): boolean {
    const role = this.getFromStorageAndDecrypt('role');
    return role === 'CUSTOMER';
  }
}
