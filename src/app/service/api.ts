import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { User } from '../model/user';
import { MessagesService } from './messages.service';
import { LoadingService } from './loading.service';
import { Response } from '../model/response';
import { Booking } from '../model/booking';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private subject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.subject.asObservable();

  private static BASE_URL = 'http://localhost:8080/api';
  private static ENCRYPTION_KEY = 'dennis-encrypt-key';

  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private messagesService: MessagesService
  ) {}

  //
  encryptAndSaveToStorage(key: string, value: string): void {
    const encryptedValue = CryptoJS.AES.encrypt(
      value,
      Api.ENCRYPTION_KEY
    ).toString();
    localStorage.setItem(key, encryptedValue);
  }

  private getFromStorageAndDecrypt(key: string): string | null {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      return CryptoJS.AES.decrypt(encryptedValue, Api.ENCRYPTION_KEY).toString(
        CryptoJS.enc.Utf8
      );
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
    return this.http.post(`${Api.BASE_URL}/auth/register`, body);
  }

  loginUser(body: any): Observable<any> {
    return this.http.post(`${Api.BASE_URL}/auth/login`, body);
  }

  getUserProfile(): Observable<User> {
    return this.http
      .get<Response>(`${Api.BASE_URL}/users/account`, {
        headers: this.getHeader(),
      })
      .pipe(
        map((response) => response['user']),
        shareReplay()
      );
  }

  getBookings(): Observable<Booking[]> {
    return this.http
      .get<Response>(`${Api.BASE_URL}/users/bookings`, {
        headers: this.getHeader(),
      })
      .pipe(
        map((response) => response['bookings']),
        shareReplay()
      );
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${Api.BASE_URL}/users/delete`, {
      headers: this.getHeader(),
    });
  }

  /*****************************
   * ROOMS API
   *****************************/

  deleteRoom(roomId: string): Observable<any> {
    return this.http.delete(`${Api.BASE_URL}/rooms/delete/${roomId}`, {
      headers: this.getHeader(),
    });
  }

  getRoomById(roomId: string): Observable<any> {
    return this.http.get(`${Api.BASE_URL}/rooms/${roomId}`);
  }

  getAllRooms(): Observable<any> {
    return this.http.get(`${Api.BASE_URL}/rooms/all`);
  }

  getRoomTypes(): Observable<any> {
    return this.http.get(`${Api.BASE_URL}/rooms/types`);
  }

  getAvailableRooms(
    checkInDate: string,
    checkOutDate: string,
    roomType: string
  ): Observable<any> {
    return this.http.get(`${Api.BASE_URL}/rooms/available`, {
      headers: this.getHeader(),
    });
  }

  updateRoom(formData: any): Observable<any> {
    return this.http.put(`${Api.BASE_URL}/rooms/`, formData, {
      headers: this.getHeader(),
    });
  }

  addRoom(formData: any): Observable<any> {
    return this.http.post(`${Api.BASE_URL}/rooms/add`, formData, {
      headers: this.getHeader(),
    });
  }

  /*****************************
   * BOOKINGS API
   *****************************/

  bookRoom(booking: any): Observable<any> {
    return this.http.post(`${Api.BASE_URL}/bookings`, booking, {
      headers: this.getHeader(),
    });
  }

  getAllBookings(): Observable<any> {
    return this.http.get(`${Api.BASE_URL}/bookings/all`, {
      headers: this.getHeader(),
    });
  }

  updateBooking(booking: any): Observable<any> {
    return this.http.put(`${Api.BASE_URL}/bookings/update`, booking, {
      headers: this.getHeader(),
    });
  }

  getBookingByReference(bookingCode: string): Observable<any> {
    return this.http.get(`${Api.BASE_URL}/bookings/${bookingCode}`);
  }

  /*****************************
   * PAYMENT API
   *****************************/

  proceedForPayment(body: any): Observable<any> {
    return this.http.post(`${Api.BASE_URL}/payments/pay`, body, {
      headers: this.getHeader(),
    });
  }

  updateBookingPayment(body: any): Observable<any> {
    return this.http.put(`${Api.BASE_URL}/payments/update`, body, {
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
