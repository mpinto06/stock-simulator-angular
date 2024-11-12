import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { AppUtilService } from '../../../../core/services/app-util.service';

@Component({
  selector: 'stock-about',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {

  phoneIcon: string;

  constructor(
    private appUtilService: AppUtilService
  ) {
    this.phoneIcon = this.appUtilService.icons['phone'];
  }
  ngOnInit(): void { }

}
