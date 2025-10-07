import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { LoadingService } from './loading.service';
import { MessagesService } from './messages.service';
import { Constants } from '../util/Constants';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private messagesService: MessagesService
  ) {}

  deleteRoom(roomId: string): Observable<any> {
    return this.http.delete(`${Constants.BASE_URL}/rooms/delete/${roomId}`, {
      headers: this.getHeader(),
    });
  }

  getRoomById(roomId: string): Observable<any> {
    return this.http.get(`${Constants.BASE_URL}/rooms/${roomId}`);
  }

  getAllRooms(): Observable<any> {
    return this.http.get(`${Constants.BASE_URL}/rooms/all`);
  }

  getRoomTypes(): Observable<any> {
    return this.http.get(`${Constants.BASE_URL}/rooms/types`);
  }

  getAvailableRooms(
    checkInDate: string,
    checkOutDate: string,
    roomType: string
  ): Observable<any> {
    return this.http.get(`${Constants.BASE_URL}/rooms/available`, {
      params: { checkInDate, checkOutDate, roomType },
    });
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

  private getHeader(): HttpHeaders {
    const token = this.getFromStorageAndDecrypt('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
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
}
