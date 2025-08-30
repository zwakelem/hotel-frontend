import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../service/api';

@Component({
  selector: 'app-roomresult',
  imports: [CommonModule],
  templateUrl: './roomresult.html',
  styleUrl: './roomresult.css',
})
export class Roomresult {
  @Input() roomSearchResults: any[] = [];
  isAdmin: boolean;

  constructor(private router: Router, private apiService: Api) {
    this.isAdmin = this.apiService.isAdmin();
  }

  navigateToEditRoom(roomId: string) {
    this.router.navigate([`/admin/edit-room/${roomId}`]);
  }

  navigateToRoomDetails(roomId: string) {
    this.router.navigate([`/room-details/${roomId}`]);
  }
}
