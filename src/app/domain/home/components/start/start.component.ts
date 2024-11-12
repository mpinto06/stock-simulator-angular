import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { AppUtilService } from '../../../../core/services/app-util.service';

@Component({
  selector: 'stock-start',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent implements OnInit {

  monitorIcon: string;
  constructor(
    private appUtilService: AppUtilService
  ) {
    this.monitorIcon = appUtilService.icons['monitor']
  }
  ngOnInit(): void { 
  }

}
