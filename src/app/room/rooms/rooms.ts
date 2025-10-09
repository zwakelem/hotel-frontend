import { ChangeDetectorRef, Component } from '@angular/core';
import { Pagination } from '../../pagination/pagination';
import { Roomresult } from '../roomresult/roomresult';
import { Roomsearch } from '../roomsearch/roomsearch';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../service/api';
import { Constants } from '../../util/Constants';
import { EMPTY, Observable } from 'rxjs';
import { Room } from '../../model/room';
import { filter, map } from 'rxjs/operators';

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
  currentPage: number = 1;
  roomsPerPage: number = 2;
  error: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    console.log('rooms - on init');
    this.rooms$ = this.apiService.getAllRooms();
    this.filteredRooms$ = this.rooms$;
  }

  showError(msg: string): void {
    this.error = msg;
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  // handleSearchResult(results: any[]) {
  //   this.filteredRooms$ = results;
  // }

  handleRoomTypeChange(event: any) {
    const selectedType = event.target.value;
    this.selectedRoomType = selectedType;
    this.filterRooms(selectedType);
  }

  filterRooms(selectedType: string) {
    this.filteredRooms$ = this.rooms$.pipe(
      map((rooms) => rooms.filter((room) => room.roomType == selectedType))
    );
  }
}
