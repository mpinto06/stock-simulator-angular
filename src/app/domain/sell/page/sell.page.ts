import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';

@Component({
  selector: 'stock-sell',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './sell.page.html',
  styleUrl: './sell.page.scss',
})
export class SellPage implements OnInit {

  ngOnInit(): void { }

}
