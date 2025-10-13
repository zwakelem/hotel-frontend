import { Component } from '@angular/core';
import { Roomresult } from '../roomresult/roomresult';
import { Roomsearch } from '../roomsearch/roomsearch';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api';
import { Constants } from '../../util/Constants';
import { EMPTY, Observable, throwError } from 'rxjs';
import { Room, sortRoomsById } from '../../model/room';
import { catchError, map } from 'rxjs/operators';
import { LoadingService } from '../../service/loading.service';
import { MessagesService } from '../../service/messages.service';

@Component({
  selector: 'app-rooms',
  imports: [Roomresult, Roomsearch, FormsModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class Rooms {
  rooms$: Observable<Room[]> = EMPTY;
  filteredRooms$: Observable<Room[]> = EMPTY;
  roomTypes: string[] = Constants.roomTypes;
  selectedRoomType: string = '';

  constructor(
    private apiService: ApiService,
    private loadingService: LoadingService,
    private messageService: MessagesService
  ) {}

  ngOnInit() {
    console.log('rooms - on init');
    this.rooms$ = this.loadingService.showLoaderUntilCompleted(
      this.apiService.getAllRooms().pipe(
        map((rooms) => rooms.sort(sortRoomsById)),
        catchError((err) => {
          const message = 'Could not load rooms';
          this.messageService.showErrors(message);
          console.log(message, err);
          return throwError(() => new Error(err));
        })
      )
    );
    this.filteredRooms$ = this.rooms$;
  }

  handleRoomTypeChange(event: any) {
    const selectedType = event.target.value;
    this.selectedRoomType = selectedType;
    this.filterRooms(selectedType);
  }

  filterRooms(selectedType: string) {
    if (selectedType) {
      this.filteredRooms$ = this.rooms$.pipe(
        map((rooms) => rooms.filter((room) => room.roomType == selectedType))
      );
    } else {
      this.filteredRooms$ = this.rooms$;
    }
  }
}
