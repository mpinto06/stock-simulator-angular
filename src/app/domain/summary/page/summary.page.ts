import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';

@Component({
  selector: 'stock-summary',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './summary.page.html',
  styleUrl: './summary.page.scss',
})
export class SummaryPage implements OnInit {

  ngOnInit(): void { }

}
