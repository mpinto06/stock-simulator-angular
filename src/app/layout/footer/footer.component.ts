import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'stock-footer',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent { }
