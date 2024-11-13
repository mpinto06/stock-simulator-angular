import { CommonModule } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { StandardCardInterface } from '../../data/interface/standard-card.interface';

@Component({
  selector: 'stock-standard-card',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './standard-card.component.html',
  styleUrl: './standard-card.component.scss',
})
export class StandardCardComponent implements OnInit {

  @Input() standardCard!: StandardCardInterface;
  ngOnInit(): void { }

}
