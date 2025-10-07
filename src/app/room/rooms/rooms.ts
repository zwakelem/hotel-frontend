import { ChangeDetectorRef, Component } from '@angular/core';
import { Pagination } from '../../pagination/pagination';
import { Roomresult } from '../roomresult/roomresult';
import { Roomsearch } from '../roomsearch/roomsearch';
import { FormsModule } from '@angular/forms';
import { Api } from '../../service/api';
import { Constants } from '../../util/Constants';

@Component({
  selector: 'app-rooms',
  imports: [Pagination, Roomresult, Roomsearch, FormsModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class Rooms {
  rooms: any[] = [];
  filteredRooms: any[] = [];
  roomTypes: string[] = Constants.roomTypes;
  selectedRoomType: string = '';
  currentPage: number = 1;
  roomsPerPage: number = 2;
  error: any = null;

  constructor(private apiService: Api) {}

  ngOnInit() {
    console.log('rooms - on init');
    // this.fetchRoomTypes();
    this.fetchRooms();
  }

  fetchRooms() {
    this.apiService.getAllRooms().subscribe({
      next: (response: any) => {
        this.rooms = response.rooms;
        console.log('rooms size ' + this.rooms.length);
        console.log(this.rooms);
        this.filteredRooms = response.rooms;
      },
      error: (err) => {
        this.showError(err?.error?.message || 'Error fetching rooms:' + err);
      },
    });
  }

  fetchRoomTypes() {
    this.apiService.getRoomTypes().subscribe({
      next: (types: string[]) => {
        this.roomTypes = types;
        console.log('room types  ' + this.roomTypes);
      },
      error: (err) => {
        this.showError(
          err?.error?.message || 'Error fetching room types:' + err
        );
      },
    });
  }

  showError(msg: string): void {
    this.error = msg;
    setTimeout(() => {
      this.error = null;
    }, 5000);
  }

  handleSearchResult(results: any[]) {
    this.rooms = results;
    this.filteredRooms = results;
  }

  handleRoomTypeChange(event: any) {
    const selectedType = event.target.value;
    this.selectedRoomType = selectedType;
    this.filterRooms(selectedType);
  }

  filterRooms(selectedType: string) {
    if (selectedType === '') {
      this.filteredRooms = this.rooms;
    } else {
      this.filteredRooms = this.rooms.filter(
        (room) => room.roomType === selectedType
      );
    }
    this.currentPage = 1;
  }

  get indexOfLastRoom() {
    return this.currentPage * this.roomsPerPage;
  }

  get indexOfFirstRoom() {
    return this.indexOfLastRoom - this.roomsPerPage;
  }

  get currentRooms() {
    return this.filteredRooms.slice(
      this.indexOfFirstRoom,
      this.indexOfLastRoom
    );
  }

  // Pagination function to change page
  paginate(pageNumber: number) {
    this.currentPage = pageNumber;
  }
}
