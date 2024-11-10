import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { AboutComponent } from '../components/about/about.component';
import { StartComponent } from '../components/start/start.component';
import { ContactComponent } from '../components/contact/contact.component';

@Component({
  selector: 'stock-home',
  standalone: true,
  imports: [
    CommonModule,
    AboutComponent,
    StartComponent,
    ContactComponent
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit {

  ngOnInit(): void { }

}
