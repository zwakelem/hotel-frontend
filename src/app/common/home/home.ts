import { Component } from '@angular/core';
import { Roomsearch } from '../../room/roomsearch/roomsearch';
import { Roomresult } from '../../room/roomresult/roomresult';

@Component({
  selector: 'app-home',
  imports: [Roomsearch, Roomresult],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  searchResults: any[] = [];

  handleSearchResult(results: any[]) {
    this.searchResults = results;
  }
}
