import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './common/navbar/navbar';
import { Footer } from './common/footer/footer';
import { LoadingService } from './service/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [LoadingService],
})
export class App {
  title = 'Hotel-Frontend';
}
