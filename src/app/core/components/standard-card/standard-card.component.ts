import { CommonModule } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { StandardCardInterface, StandardCardMessageInterface } from '../../data/interface/standard-card.interface';
import { AppUtilService } from '../../services/app-util.service';
import { Router } from '@angular/router';

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

  constructor( 
    private appUtils: AppUtilService,
    private router: Router
  ) { }
  ngOnInit(): void { }


  get cardMessage(): StandardCardMessageInterface | undefined {
    if (!this.standardCard?.message) {
      return undefined;
    }
    return this.appUtils.cardMessages[this.standardCard?.message];
  }

  redirectSummary(): void {
    this.router.navigate(['/summary']).catch();
  }

}
