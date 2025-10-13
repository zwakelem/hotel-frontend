import { Component } from '@angular/core';
import { Roomresult } from '../roomresult/roomresult';
import { Roomsearch } from '../roomsearch/roomsearch';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api';
import { Constants } from '../../util/Constants';
import { EMPTY, Observable } from 'rxjs';
import { Room, sortRoomsById } from '../../model/room';
import { map } from 'rxjs/operators';
import { LoadingService } from '../../service/loading.service';

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
  error: any = null;

  constructor(
    private apiService: ApiService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    console.log('rooms - on init');
    this.rooms$ = this.loadingService.showLoaderUntilCompleted(
      this.apiService
        .getAllRooms()
        .pipe(map((rooms) => rooms.sort(sortRoomsById)))
    );
    this.filteredRooms$ = this.rooms$;
  }

  showError(msg: string): void {
    this.error = msg;
    setTimeout(() => {
      this.error = null;
    }, 5000);
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
